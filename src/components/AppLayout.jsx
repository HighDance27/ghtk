import { Layout, Badge } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Layout.css";

const { Header, Footer, Content } = Layout;
export const CartContext = createContext();

const AppLayout = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    return (
        <CartContext.Provider value={{ cartItems, setCartItems }}>
            <Layout className="app-layout">
                <Header className="header"
                    style={{ display: "flex", justifyContent: "space-between" }}>
                    Cửa Hàng Điện Tử
                    <Badge count={cartItems.length} offset={[0, -2]}>
                        <ShoppingCartOutlined className="cart-icon"
                            style={{
                                cursor: "pointer",
                                fontSize: "30px", color: "white"
                            }}
                            onClick={() => navigate("/cart")}
                        />
                    </Badge>
                </Header>
                <Content className="content">{children}</Content>
                <Footer className="footer">&copy; 2025 Cửa Hàng Điện Tử. All rights reserved.</Footer>
            </Layout>
        </CartContext.Provider>
    );
};

export default AppLayout;
