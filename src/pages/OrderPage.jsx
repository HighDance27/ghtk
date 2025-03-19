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
            // Tạo URL với tất cả các tham số
            const callbackUrl = `http://localhost:8080/api/vnpay/payment-callback?${params.toString()}`;

            // Gọi API callback
            const response = await axios.get(callbackUrl);

            if (response.data && response.data.success) {
                // Thanh toán thành công
                setCartItems([]);
                localStorage.removeItem('cartFormData');

                // Lấy thông tin đơn hàng từ localStorage
                const savedOrderData = localStorage.getItem('orderData');
                const orderInfo = savedOrderData ? JSON.parse(savedOrderData) : null;

                // Xóa dữ liệu đơn hàng khỏi localStorage sau khi đã lấy
                localStorage.removeItem('orderData');

                navigate('/thank-you', { state: { orderData: orderInfo } });
            } else {
                // Thanh toán thất bại
                navigate('/payment-failed');
            }
        } catch (error) {
            console.error("Lỗi khi xử lý callback:", error);
            navigate('/payment-failed');
        } finally {
            setLoading(false);
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
