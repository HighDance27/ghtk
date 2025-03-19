import { useContext } from "react";
import { CartContext } from "../components/AppLayout";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Typography, Layout, Table, Button, message } from "antd";
import { createVNPayPaymentAPI } from "../services/api.service";
import "./OrderPage.css";

const { Title, Text } = Typography;
const { Content } = Layout;

const OrderPage = () => {
    const { cartItems, setCartItems } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();
    const orderData = location.state?.orderData;

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
        try {
            const response = await createVNPayPaymentAPI(totalAmount);
            console.log("Phản hồi từ VNPay API:", response.data);

            if (response.data) {
                // Xóa giỏ hàng và form data trước khi chuyển hướng
                setCartItems([]);
                localStorage.removeItem('cartFormData');
                window.location.href = response.data;
            } else {
                message.error("Không thể tạo thanh toán VNPay.");
            }
        } catch (error) {
            console.error("Lỗi khi kết nối đến VNPay:", error);
            message.error("Lỗi khi kết nối đến VNPay. Vui lòng thử lại!");
        }
    };

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
                        <Button type="primary" block onClick={handleVNPayPayment} style={{ marginTop: "20px" }}>
                            Xác nhận & Thanh toán VNPay
                        </Button>
                    </Card>
                )}
            </Content>
        </Layout>
    );
};

export default OrderPage;
