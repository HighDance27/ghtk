import { useContext } from "react";
import { CartContext } from "../components/AppLayout";
import { Card, Button, Typography, List, Layout, message, Form, Input } from "antd";
import "./OrderPage.css";

const { Title, Text } = Typography;
const { Content } = Layout;

const OrderPage = () => {
    const { cartItems, setCartItems } = useContext(CartContext);

    const handleOrderSubmit = (values) => {
        if (cartItems.length === 0) {
            message.warning("Giỏ hàng của bạn đang trống.");
            return;
        }

        message.success("Đơn hàng đã được đặt thành công!");
        setCartItems([]); // Xóa giỏ hàng sau khi đặt hàng
    };

    return (
        <Layout className="order-page">
            <Content className="order-content">
                <Title level={2}>Xác Nhận Đơn Hàng</Title>
                {cartItems.length === 0 ? (
                    <Text>Không có sản phẩm nào trong đơn hàng.</Text>
                ) : (
                    <List
                        dataSource={cartItems}
                        renderItem={(item) => (
                            <Card className="order-item" key={item.id}>
                                <img src={item.image} alt={item.name} className="order-item-image" />
                                <div className="order-item-info">
                                    <Title level={4}>{item.name}</Title>
                                    <Text strong>
                                        {new Intl.NumberFormat('vi-VN', { style: "currency", currency: "VND" }).format(item.price)}
                                    </Text>
                                    <br />
                                    <Text>Số lượng: {item.quantity}</Text>
                                </div>
                            </Card>
                        )}
                    />
                )}
                <Form onFinish={handleOrderSubmit} className="order-form">
                    <Form.Item name="name" rules={[{ required: true, message: "Vui lòng nhập tên của bạn!" }]}>
                        <Input placeholder="Họ và Tên" />
                    </Form.Item>
                    <Form.Item name="address" rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}>
                        <Input placeholder="Địa chỉ giao hàng" />
                    </Form.Item>
                    <Form.Item name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}>
                        <Input placeholder="Số điện thoại" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Xác nhận đơn hàng
                    </Button>
                </Form>
            </Content>
        </Layout>
    );
};

export default OrderPage;