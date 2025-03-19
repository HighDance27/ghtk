import { useContext } from "react";
import { CartContext } from "../components/AppLayout";
import { useNavigate } from "react-router-dom";
import { Card, Button, Typography, List, Layout, message, Empty, InputNumber } from "antd";
import "./CartPage.css";

const { Title, Text } = Typography;
const { Content } = Layout;

const CartPage = () => {
    const { cartItems, setCartItems } = useContext(CartContext);
    const navigate = useNavigate();

    const handleRemoveItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
        message.success("Sản phẩm đã được xóa khỏi giỏ hàng.");
    };

    const handleQuantityChange = (id, quantity) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity } : item
        ));
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            message.warning("Giỏ hàng của bạn đang trống.");
            return;
        }
        navigate("/order");
    };

    return (
        <Layout className="cart-page">
            <Content className="cart-content">
                <Title level={2}>Giỏ Hàng Của Bạn</Title>
                {cartItems.length === 0 ? (
                    <Empty />
                ) : (
                    <List
                        dataSource={cartItems}
                        renderItem={(item) => (
                            <Card className="cart-item" key={item.id}>
                                <img src={item.image} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-info">
                                    <Title level={4}>{item.name}</Title>
                                    <Text strong>
                                        {new Intl.NumberFormat('vi-VN', { style: "currency", currency: "VND" }).format(item.price)}
                                    </Text>
                                    <div className="quantity-control">
                                        <Text>Số lượng: </Text>
                                        <InputNumber
                                            min={1}
                                            value={item.quantity}
                                            onChange={(value) => handleQuantityChange(item.id, value)}
                                        />
                                    </div>
                                    <Button type="link" danger onClick={() => handleRemoveItem(item.id)}>Xóa</Button>
                                </div>
                            </Card>
                        )}
                    />
                )}
                {cartItems.length > 0 && (
                    <Button type="primary" className="checkout-button" block onClick={handleCheckout}>
                        Tiến hành thanh toán
                    </Button>
                )}
            </Content>
        </Layout>
    );
};

export default CartPage;
