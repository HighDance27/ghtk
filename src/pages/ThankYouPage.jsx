import { useLocation, Link } from "react-router-dom";
import { Layout, Typography, Button, Card, Result } from "antd";
import { CheckCircleOutlined, HomeOutlined, ShoppingOutlined } from "@ant-design/icons";
import "./ThankYouPage.css";

const { Content } = Layout;
const { Title, Text } = Typography;

const ThankYouPage = () => {
    const location = useLocation();
    const orderData = location.state?.orderData;

    if (!orderData) {
        return (
            <Layout className="thank-you-page">
                <Content className="thank-you-content">
                    <Result
                        status="error"
                        title="Không tìm thấy thông tin đơn hàng"
                        subTitle="Vui lòng quay lại trang chủ và thử lại"
                        extra={[
                            <Link to="/" key="home">
                                <Button type="primary" icon={<HomeOutlined />}>
                                    Về trang chủ
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