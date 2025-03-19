import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductByIdAPI } from "../services/api.service";
import { Card, Typography, Button, message, notification } from "antd";
import { useContext } from "react";
import { CartContext } from "../components/AppLayout";
import "../components/ProductDetail.css";

const { Title, Text } = Typography;

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { cartItems, setCartItems } = useContext(CartContext);

    useEffect(() => {
        const loadProduct = async () => {
            if (!id) {
                console.error("ID sản phẩm không hợp lệ");
                return;
            }
            const productData = await fetchProductByIdAPI(id);
            setProduct(productData?.data || null);
            setLoading(false);
        };

        loadProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;

        setCartItems(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });

        notification.success({
            message: "Thêm vào giỏ hàng",
            description: "Sản phẩm đã được thêm vào giỏ hàng thành công!",
            placement: "top",
        });
    };

    if (loading) return <p>Đang tải...</p>;
    if (!product) return <p>Không tìm thấy sản phẩm.</p>;

    return (
        <div className="product-detail">
            <Card className="detail-card" cover={<img src={product.image} alt={product.name} className="detail-image" />}>
                <Title level={2}>{product.name}</Title>
                <Text strong className="detail-price">
                    {new Intl.NumberFormat('vi-VN', { style: "currency", currency: "VND" }).format(product.price)}
                </Text>
                {product.oldPrice && (
                    <Text delete className="detail-old-price">
                        {new Intl.NumberFormat('vi-VN', { style: "currency", currency: "VND" }).format(product.oldPrice)}
                    </Text>
                )}
                <p><strong>Khối lượng:</strong> {product.weight}kg</p>
                <p><strong>Số lượng trong kho:</strong> {product.inventory}</p>
                <Button type="primary" block onClick={handleAddToCart}>
                    Thêm vào giỏ hàng
                </Button>
            </Card>
        </div>
    );
};

export default ProductDetail;
