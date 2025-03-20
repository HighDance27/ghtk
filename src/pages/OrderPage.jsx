import { useContext, useEffect, useState } from "react";
import { CartContext } from "../components/AppLayout";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Typography, Layout, Table, Button, message, Spin } from "antd";
import { createVNPayPaymentAPI } from "../services/api.service";
import axios from "axios";
import "./OrderPage.css";

const { Title, Text } = Typography;
const { Content } = Layout;

const OrderPage = () => {
    const { cartItems, setCartItems } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [orderData, setOrderData] = useState(location.state?.orderData || null);
    const [loading, setLoading] = useState(false);

    // Khôi phục thông tin đơn hàng từ localStorage nếu có
    useEffect(() => {
        if (!orderData) {
            const savedOrderData = localStorage.getItem('orderData');
            if (savedOrderData) {
                setOrderData(JSON.parse(savedOrderData));
            }
        }
    }, [orderData]);

    // Hàm gửi request đến GHTK
    const sendGHTKRequest = async () => {
        try {
            // Sử dụng dữ liệu mẫu
            const ghtkData = {
                "products": [
                    {
                        "name": "bút",
                        "weight": 0.1,
                        "quantity": 1,
                        "product_code": 1241
                    },
                    {
                        "name": "tẩy",
                        "weight": 0.2,
                        "quantity": 1,
                        "product_code": 1254
                    },
                    {
                        "name": "đá",
                        "weight": 2,
                        "quantity": 13,
                        "product_code": 1255
                    }
                ],
                "order": {
                    "id": "DH52110529",
                    "pick_name": "Châu Nguyễn Trường An",
                    "pick_money": 0,
                    "pick_address": "nhà số 170/1 Nguyễn Thị Mười",
                    "pick_province": "Thành Phố Hồ Chí Minh",
                    "pick_district": "Quận 8",
                    "pick_tel": "0783891752",
                    "name": "An",
                    "address": "180 Cao Lỗ",
                    "province": "Thành Phố Hồ Chí Minh",
                    "district": "Quận 8",
                    "ward": "Phường 4",
                    "street": "Cao Lỗ",
                    "hamlet": "Khác",
                    "tel": "0772097482",
                    "email": "anchau03102003",
                    "return_name": "Châu Nguyễn Trường An",
                    "return_address": "nhà số 170/1",
                    "return_provice": "Thành Phố Hồ Chí Minh",
                    "return_ward": "Quận 8",
                    "return_tel": "0783891752",
                    "return_eamail": "anchau03102003@gmail.com",
                    "value": 10000
                }
            };

            console.log('Dữ liệu gửi đến GHTK:', JSON.stringify(ghtkData, null, 2));

            const headers = {
                'X-Client-Source': 'S22863729',
                'Token': '172X8NEx658WXkBW1oMX7s0SvCl9eODsA53yPmq',
                'Content-Type': 'application/json'
            };

            const response = await axios.post('https://services.giaohangtietkiem.vn/services/shipment/order', ghtkData, { headers });

            console.log('Phản hồi từ GHTK:', JSON.stringify(response.data, null, 2));

            if (response.data && response.data.success) {
                // Lưu tracking order vào localStorage
                localStorage.setItem('tracking_order', response.data.order_info.tracking_id);
                console.log('Đã lưu tracking order:', response.data.order_info.tracking_id);
                return response.data;
            } else {
                throw new Error('GHTK request failed');
            }
        } catch (error) {
            console.error('Chi tiết lỗi GHTK:', error.response?.data || error.message);
            throw error;
        }
    };

    // Kiểm tra nếu người dùng đến từ VNPay với trạng thái thanh toán
    useEffect(() => {
        // Lấy các tham số trong URL
        const urlParams = new URLSearchParams(window.location.search);
        const vnpResponseCode = urlParams.get('vnp_ResponseCode');

        if (vnpResponseCode) {
            handlePaymentCallback(urlParams);
        }
    }, [navigate]);

    // Xử lý callback từ VNPay
    const handlePaymentCallback = async (params) => {
        setLoading(true);
        try {
            console.log('=== BẮT ĐẦU XỬ LÝ CALLBACK TỪ VNPAY ===');
            console.log('Các tham số từ VNPay:', Object.fromEntries(params));

            // Tạo URL với tất cả các tham số
            const callbackUrl = `http://localhost:8080/api/vnpay/payment-callback?${params.toString()}`;
            console.log('URL callback:', callbackUrl);

            // Gọi API callback
            const response = await axios.get(callbackUrl);
            console.log('Phản hồi từ API callback:', response.data);

            if (response.data && response.data.success) {
                console.log('Thanh toán VNPay thành công!');
                // Thanh toán thành công
                setCartItems([]);
                localStorage.removeItem('cartFormData');

                // Lấy thông tin đơn hàng từ localStorage
                const savedOrderData = localStorage.getItem('orderData');
                const orderInfo = savedOrderData ? JSON.parse(savedOrderData) : null;
                console.log('Thông tin đơn hàng:', orderInfo);

                if (orderInfo) {
                    console.log('Bắt đầu gửi request đến GHTK...');
                    // Gửi request đến GHTK
                    const ghtkResponse = await sendGHTKRequest();
                    console.log('Kết quả từ GHTK:', ghtkResponse);
                }

                // Xóa dữ liệu đơn hàng khỏi localStorage sau khi đã lấy
                localStorage.removeItem('orderData');
                console.log('Đã xóa dữ liệu đơn hàng khỏi localStorage');

                console.log('Chuyển hướng đến trang thank-you...');
                navigate('/thank-you', { state: { orderData: orderInfo } });
            } else {
                console.log('Thanh toán VNPay thất bại!');
                // Thanh toán thất bại
                navigate('/payment-failed');
            }
        } catch (error) {
            console.error("Chi tiết lỗi khi xử lý callback:", error.response?.data || error.message);
            navigate('/payment-failed');
        } finally {
            setLoading(false);
            console.log('=== KẾT THÚC XỬ LÝ CALLBACK TỪ VNPAY ===');
        }
    };

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const columns = [
        {
            title: "Sản phẩm",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Hình ảnh",
            dataIndex: "image",
            key: "image",
            render: (text, record) => <img src={record.image} alt={record.name} className="order-item-image" />,
        },
        {
            title: "Giá tiền",
            dataIndex: "price",
            key: "price",
            render: (text) => (
                <Text strong style={{ color: "green", fontSize: "16px" }}>
                    {new Intl.NumberFormat('vi-VN', { style: "currency", currency: "VND" }).format(text)}
                </Text>
            ),
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
        }
    ];

    const handleVNPayPayment = async () => {
        setLoading(true);
        try {
            // Lưu thông tin đơn hàng vào localStorage trước khi chuyển hướng
            if (location.state?.orderData) {
                localStorage.setItem('orderData', JSON.stringify(location.state.orderData));
            }

            const response = await createVNPayPaymentAPI(totalAmount);
            console.log("Phản hồi từ VNPay API:", response.data);

            if (response.data) {
                // Chuyển hướng đến trang thanh toán VNPay
                window.location.href = response.data;
            } else {
                message.error("Không thể tạo thanh toán VNPay.");
                navigate('/payment-failed');
            }
        } catch (error) {
            console.error("Lỗi khi kết nối đến VNPay:", error);
            message.error("Lỗi khi kết nối đến VNPay. Vui lòng thử lại!");
            navigate('/payment-failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout className="order-page">
                <Content className="order-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Spin size="large" tip="Đang xử lý thanh toán..." />
                </Content>
            </Layout>
        );
    }

    return (
        <Layout className="order-page">
            <Content className="order-content">
                <Title level={2}>Xác Nhận Đơn Hàng</Title>
                {cartItems.length === 0 ? (
                    <Text>Không có sản phẩm nào trong đơn hàng.</Text>
                ) : (
                    <Card className="order-summary">
                        <Table
                            dataSource={cartItems}
                            columns={columns}
                            pagination={false}
                            rowKey="id"
                        />
                        <div className="order-total">
                            <Title level={3} style={{ color: "red" }}>Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: "currency", currency: "VND" }).format(totalAmount)}</Title>
                        </div>
                        <Button type="primary" block onClick={handleVNPayPayment} style={{ marginTop: "20px" }} loading={loading}>
                            Xác nhận & Thanh toán VNPay
                        </Button>
                    </Card>
                )}
            </Content>
        </Layout>
    );
};

export default OrderPage;
