import { useEffect, useState } from "react";
import { Card, Badge, Button, Tooltip, FloatButton } from "antd";
import { useNavigate } from "react-router-dom";
import { AppstoreAddOutlined, PlusCircleOutlined, PlusOutlined, ProductFilled, ProductOutlined } from "@ant-design/icons";
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

            <FloatButton.Group
                trigger="hover"
                style={{
                    right: 24,
                    bottom: 24,

                }}
            >
                <Tooltip title="Thêm danh mục sản phẩm" placement="left">
                    <FloatButton
                        icon={<AppstoreAddOutlined />}
                        onClick={() => navigate('/add-category')}
                    />
                </Tooltip>
                <Tooltip title="Thêm sản phẩm mới" placement="left">
                    <FloatButton
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => navigate('/add-product')}
                    />
                </Tooltip>
            </FloatButton.Group>
        </>
    );
};

export default ProductGrid;
