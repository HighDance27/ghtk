import { useLocation, Link } from "react-router-dom";
import { Layout, Typography, Button, Card, Result, message } from "antd";
import { CheckCircleOutlined, HomeOutlined, ShoppingOutlined } from "@ant-design/icons";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../components/AppLayout";
import "./ThankYouPage.css";

const { Content } = Layout;
const { Title, Text } = Typography;

const ThankYouPage = () => {
    const location = useLocation();
    const { setCartItems } = useContext(CartContext);
    const [orderData, setOrderData] = useState(location.state?.orderData || null);

    // Cố gắng khôi phục thông tin đơn hàng từ localStorage nếu không có trong location state
    useEffect(() => {
        if (!orderData) {
            const savedOrderData = localStorage.getItem('orderData');
            if (savedOrderData) {
                try {
                    const parsedData = JSON.parse(savedOrderData);
                    setOrderData(parsedData);
                    // Xóa dữ liệu sau khi đã sử dụng
                    localStorage.removeItem('orderData');
                } catch (error) {
                    console.error("Lỗi khi phân tích dữ liệu đơn hàng:", error);
                }
            }
        }
    }, [orderData]);

    // Kiểm tra nếu có tham số vnp_ResponseCode = 00 (thanh toán thành công)
    // và đảm bảo giỏ hàng được xóa khi vào trang thank-you
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const vnpResponseCode = urlParams.get('vnp_ResponseCode');

        if (vnpResponseCode === '00') {
            message.success("Thanh toán thành công!");
        }

        // Đảm bảo giỏ hàng được xóa khi vào trang thank-you, 
        // ngay cả khi người dùng truy cập trực tiếp thông qua URL
        setCartItems([]);
        localStorage.removeItem('cartFormData');
    }, [setCartItems]);

    if (!orderData) {
        return (
            <Layout className="thank-you-page">
                <Content className="thank-you-content">
                    <Result
                        status="warning"
                        title="Không tìm thấy thông tin đơn hàng"
                        subTitle="Đơn hàng của bạn có thể đã được xử lý, nhưng không thể hiển thị chi tiết"
                        extra={[
                            <Link to="/" key="home">
                                <Button type="primary" icon={<HomeOutlined />}>
                                    Về trang chủ
                                </Button>
                            </Link>,
                            <Link to="/cart" key="cart">
                                <Button icon={<ShoppingOutlined />}>
                                    Giỏ hàng
                                </Button>
                            </Link>
                        ]}
                    />
                </Content>
            </Layout>
        );
    }

    return (
        <Layout className="thank-you-page">
            <Content className="thank-you-content">
                <Result
                    status="success"
                    icon={<CheckCircleOutlined />}
                    title="Đặt hàng thành công!"
                    subTitle="Cảm ơn bạn đã mua hàng tại MyShop"
                    extra={[
                        <Link to="/" key="home">
                            <Button type="primary" icon={<HomeOutlined />}>
                                Về trang chủ
                            </Button>
                        </Link>,
                    ]}
                />

                <Card className="order-summary" title="Thông tin đơn hàng">
                    <div className="order-info">
                        <div className="info-row">
                            <Text strong>Mã đơn hàng:</Text>
                            <Text>{orderData.id || "Đang xử lý"}</Text>
                        </div>
                        <div className="info-row">
                            <Text strong>Ngày đặt:</Text>
                            <Text>{new Date().toLocaleDateString('vi-VN')}</Text>
                        </div>
                        <div className="info-row">
                            <Text strong>Phương thức thanh toán:</Text>
                            <Text>{orderData.payment_method === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Thanh toán qua VNPay'}</Text>
                        </div>
                        <div className="info-row">
                            <Text strong>Tổng tiền:</Text>
                            <Text>{new Intl.NumberFormat('vi-VN', { style: "currency", currency: "VND" }).format(orderData.total)}</Text>
                        </div>
                    </div>

                    <div className="customer-info">
                        <Title level={4}>Thông tin giao hàng</Title>
                        <div className="info-row">
                            <Text strong>Họ và tên:</Text>
                            <Text>{orderData.full_name}</Text>
                        </div>
                        <div className="info-row">
                            <Text strong>Số điện thoại:</Text>
                            <Text>{orderData.tel}</Text>
                        </div>
                        <div className="info-row">
                            <Text strong>Địa chỉ:</Text>
                            <Text>{orderData.address}</Text>
                        </div>
                        {orderData.note && (
                            <div className="info-row">
                                <Text strong>Ghi chú:</Text>
                                <Text>{orderData.note}</Text>
                            </div>
                        )}
                    </div>

                    <div className="order-items">
                        <Title level={4}>Sản phẩm đã đặt</Title>
                        {orderData.items.map((item, index) => (
                            <div key={index} className="order-item">
                                <img src={item.image} alt={item.name} className="item-image" />
                                <div className="item-info">
                                    <Text strong>{item.name}</Text>
                                    <Text>Số lượng: {item.quantity}</Text>
                                    <Text>{new Intl.NumberFormat('vi-VN', { style: "currency", currency: "VND" }).format(item.price)}</Text>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </Content>
        </Layout>
    );
};

export default ThankYouPage; 