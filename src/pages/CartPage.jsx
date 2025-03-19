import { useContext, useState, useEffect } from "react";
import { CartContext } from "../components/AppLayout";
import { useNavigate, Link } from "react-router-dom";
import { Card, Button, Typography, List, Layout, message, Empty, Input, Radio, Form, Select } from "antd";
import { DeleteOutlined, CreditCardOutlined, DollarOutlined } from '@ant-design/icons';
import { fetchProvincesAPI, fetchDistrictsAPI, fetchWardsAPI } from "../services/api.service";
import "./CartPage.css";

const { Title, Text } = Typography;
const { Content } = Layout;

const CartPage = () => {
    const { cartItems, setCartItems } = useContext(CartContext);
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [quantities, setQuantities] = useState({});
    const [provinces, setProvinces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [districts, setDistricts] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [wards, setWards] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [loadingWards, setLoadingWards] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');

    // Fetch provinces data
    const fetchProvinces = async (searchText = '') => {
        setLoading(true);
        try {
            const response = await fetchProvincesAPI(searchText);
            if (response.data && response.data.data) {
                setProvinces(response.data.data);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách tỉnh thành:', error);
            message.error('Không thể lấy danh sách tỉnh thành');
        } finally {
            setLoading(false);
        }
    };

    // Fetch initial provinces data
    useEffect(() => {
        fetchProvinces();
    }, []);

    const handleProvinceSearch = async (searchText) => {
        if (searchText) {
            await fetchProvinces(searchText);
        } else {
            await fetchProvinces();
        }
    };

    const fetchDistricts = async (provinceId, searchText = '') => {
        if (!provinceId) return;
        setLoadingDistricts(true);
        try {
            const response = await fetchDistrictsAPI(provinceId, searchText);
            if (response.data && response.data.data) {
                setDistricts(response.data.data);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách quận huyện:', error);
            message.error('Không thể lấy danh sách quận huyện');
        } finally {
            setLoadingDistricts(false);
        }
    };

    const fetchWards = async (districtId, searchText = '') => {
        if (!districtId) return;
        setLoadingWards(true);
        try {
            const response = await fetchWardsAPI(districtId, searchText);
            if (response.data && response.data.data) {
                setWards(response.data.data);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách phường xã:', error);
            message.error('Không thể lấy danh sách phường xã');
        } finally {
            setLoadingWards(false);
        }
    };

    const handleProvinceChange = (value) => {
        setSelectedProvince(value);
        setSelectedDistrict(null);
        form.setFieldsValue({ district: undefined, ward: undefined }); // Reset both district and ward
        fetchDistricts(value);
    };

    const handleDistrictChange = (value) => {
        setSelectedDistrict(value);
        form.setFieldValue('ward', undefined); // Reset ward selection
        fetchWards(value);
    };

    const handleDistrictSearch = async (searchText) => {
        if (selectedProvince) {
            await fetchDistricts(selectedProvince, searchText);
        }
    };

    const handleWardSearch = async (searchText) => {
        if (selectedDistrict) {
            await fetchWards(selectedDistrict, searchText);
        }
    };

    // Khởi tạo số lượng mặc định là 1 cho mỗi sản phẩm
    useEffect(() => {
        const initialQuantities = {};
        cartItems.forEach(item => {
            initialQuantities[item.id] = item.quantity || 1;
        });
        setQuantities(initialQuantities);
    }, [cartItems]);

    const updateCartItemQuantity = (id, quantity) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const handleQuantityChange = (id, value) => {
        const newQuantity = Math.max(1, value);
        setQuantities(prev => ({
            ...prev,
            [id]: newQuantity
        }));
        updateCartItemQuantity(id, newQuantity);
    };

    const handleIncrement = (id) => {
        const newQuantity = (quantities[id] || 1) + 1;
        setQuantities(prev => ({
            ...prev,
            [id]: newQuantity
        }));
        updateCartItemQuantity(id, newQuantity);
    };

    const handleDecrement = (id) => {
        const newQuantity = Math.max(1, (quantities[id] || 1) - 1);
        setQuantities(prev => ({
            ...prev,
            [id]: newQuantity
        }));
        updateCartItemQuantity(id, newQuantity);
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + item.price * (quantities[item.id] || 1);
        }, 0);
    };

    const handleRemoveItem = (id) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        setQuantities(prev => {
            const newQuantities = { ...prev };
            delete newQuantities[id];
            return newQuantities;
        });
        message.success("Sản phẩm đã được xóa khỏi giỏ hàng.");
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            message.warning("Giỏ hàng của bạn đang trống.");
            return;
        }
        form.validateFields().then(values => {
            const orderData = {
                ...values,
                items: cartItems.map(item => ({
                    ...item,
                    quantity: quantities[item.id] || 1
                })),
                total: calculateTotal(),
                payment_method: paymentMethod
            };

            if (paymentMethod === 'cod') {
                // Thanh toán COD - chuyển đến trang cảm ơn
                setCartItems([]); // Xóa giỏ hàng
                localStorage.removeItem('cartFormData'); // Xóa form data
                navigate("/thank-you", { state: { orderData } });
            } else {
                // Thanh toán VNPay - chuyển đến trang order
                navigate("/order", { state: { orderData } });
            }
        }).catch(() => {
            message.error("Vui lòng nhập đầy đủ thông tin khách hàng.");
        });
    };

    return (
        <Layout className="cart-page">
            <Content className="cart-content">
                <Link to="/">
                    <Button type="link" style={{ marginBottom: 20 }}>
                        ← Tiếp tục mua hàng
                    </Button>
                </Link>

                {cartItems.length === 0 ? (
                    <Empty description="Giỏ hàng của bạn đang trống" />
                ) : (
                    <>
                        <List
                            dataSource={cartItems}
                            renderItem={(item) => (
                                <Card className="cart-item" key={item.id}>
                                    <div className="cart-item-row">
                                        <img src={item.image} alt={item.name} className="cart-item-image" />

                                        <div className="cart-item-main">
                                            <Title level={4} className="item-name">{item.name}</Title>
                                            <div className="item-price">
                                                {new Intl.NumberFormat('vi-VN', { style: "currency", currency: "VND" }).format(item.price)}
                                                {item.discount && <span className="discount-tag">{item.discount}%</span>}
                                            </div>
                                        </div>

                                        <div className="quantity-controls">
                                            <Button onClick={() => handleDecrement(item.id)}>-</Button>
                                            <Input
                                                value={quantities[item.id] || 1}
                                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                                style={{ width: 50, textAlign: 'center' }}
                                            />
                                            <Button onClick={() => handleIncrement(item.id)}>+</Button>
                                        </div>

                                        <Button
                                            type="text"
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="remove-button"
                                        />
                                    </div>
                                </Card>
                            )}
                        />

                        <div className="cart-summary">
                            <Title level={4}>Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: "currency", currency: "VND" }).format(calculateTotal())}</Title>
                        </div>

                        <Title level={3}>THÔNG TIN KHÁCH HÀNG</Title>
                        <Form form={form} layout="vertical">
                            <Form.Item name="gender" label="" rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}>
                                <Radio.Group>
                                    <Radio value="male">Anh</Radio>
                                    <Radio value="female">Chị</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item name="full_name" label="Họ và tên *" rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}>
                                <Input placeholder="Nhập họ và tên" />
                            </Form.Item>

                            <Form.Item name="tel" label="Số điện thoại *" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
                                <Input placeholder="Nhập số điện thoại" />
                            </Form.Item>

                            <Form.Item name="province" label="Tỉnh thành" rules={[{ required: true, message: "Vui lòng chọn tỉnh thành" }]}>
                                <Select
                                    showSearch
                                    placeholder="Chọn tỉnh thành"
                                    loading={loading}
                                    onSearch={handleProvinceSearch}
                                    onChange={handleProvinceChange}
                                    filterOption={false}
                                    options={provinces.map(province => ({
                                        value: province.id,
                                        label: province.name
                                    }))}
                                />
                            </Form.Item>

                            <Form.Item name="district" label="Quận huyện" rules={[{ required: true, message: "Vui lòng chọn quận huyện" }]}>
                                <Select
                                    showSearch
                                    placeholder={selectedProvince ? "Chọn quận huyện" : "Vui lòng chọn tỉnh thành trước"}
                                    loading={loadingDistricts}
                                    onSearch={handleDistrictSearch}
                                    onChange={handleDistrictChange}
                                    filterOption={false}
                                    disabled={!selectedProvince}
                                    options={districts.map(district => ({
                                        value: district.id,
                                        label: district.name
                                    }))}
                                />
                            </Form.Item>

                            <Form.Item name="ward" label="Phường xã" rules={[{ required: true, message: "Vui lòng chọn phường xã" }]}>
                                <Select
                                    showSearch
                                    placeholder={selectedDistrict ? "Chọn phường xã" : "Vui lòng chọn quận huyện trước"}
                                    loading={loadingWards}
                                    onSearch={handleWardSearch}
                                    filterOption={false}
                                    disabled={!selectedDistrict}
                                    options={wards.map(ward => ({
                                        value: ward.id,
                                        label: ward.name
                                    }))}
                                />
                            </Form.Item>

                            <Form.Item name="address" label="Tên đường, số nhà " rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}>
                                <Input placeholder="Nhập tên đường, số nhà" />
                            </Form.Item>
                            <Form.Item name="note" label="Ghi chú">
                                <Input.TextArea placeholder="Nhập ghi chú cho đơn hàng" rows={3} />
                            </Form.Item>

                            <Form.Item name="payment_method" label="Phương thức thanh toán" rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán" }]}>
                                <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod}>
                                    <Radio.Button value="cod">
                                        <DollarOutlined /> Thanh toán khi nhận hàng
                                    </Radio.Button>
                                    <Radio.Button value="vnpay">
                                        <CreditCardOutlined /> Thanh toán qua VNPay
                                    </Radio.Button>
                                </Radio.Group>
                            </Form.Item>

                            <div className="payment-info">
                                {paymentMethod === 'cod' ? (
                                    <div className="cod-info">
                                        <Title level={5}>Thanh toán khi nhận hàng (COD)</Title>
                                        <Text>Quý khách sẽ thanh toán bằng tiền mặt khi nhận được hàng</Text>
                                    </div>
                                ) : (
                                    <div className="vnpay-info">
                                        <Title level={5}>Thanh toán qua VNPay</Title>
                                        <Text>Quý khách sẽ được chuyển đến cổng thanh toán VNPay để hoàn tất thanh toán</Text>
                                    </div>
                                )}
                            </div>

                        </Form>

                        <Button
                            type="primary"
                            className="checkout-button"
                            block
                            onClick={handleCheckout}
                            icon={paymentMethod === 'vnpay' ? <CreditCardOutlined /> : <DollarOutlined />}
                        >
                            {paymentMethod === 'vnpay' ? 'Thanh toán qua VNPay' : 'Đặt hàng và thanh toán khi nhận hàng'}
                        </Button>
                    </>
                )}
            </Content>
        </Layout>
    );
};

export default CartPage;
