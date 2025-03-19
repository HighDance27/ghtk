import { useEffect, useState } from "react";
import { Card, Badge, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchAllProductAPI } from "../services/api.service";
import "../components/ProductGrid.css";

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadProducts = async () => {
            const res = await fetchAllProductAPI();
            if (res.data) setProducts(res.data);
        };
        loadProducts();
    }, []);

    return (
        <>
            <div className="product-grid">
                {products.map((product) => (
                    <Badge.Ribbon text="Trả góp 0%" color="red" key={product.id}>
                        <Card
                            hoverable
                            className="product-card"
                            cover={<img
                                src={product.image}
                                alt={product.name}
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/product/${product.id}`)}
                            />}
                        >
                            {product.discount && (
                                <Badge.Ribbon text={`-${product.discount}%`} color="volcano" placement="start" />
                            )}
                            <h3 style={{ fontSize: "16px" }}>{product.name}</h3>
                            <p className="price">
                                {new Intl.NumberFormat('vi-VN', { style: "currency", currency: "VND" }).format(product.price)}
                            </p>

                            <Button type="primary" block
                                onClick={() => navigate(`/product/${product.id}`)}>Xem chi tiết</Button>
                        </Card>
                    </Badge.Ribbon>
                ))}
            </div>
        </>
    );

};

export default ProductGrid;
