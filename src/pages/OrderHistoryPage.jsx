import { Layout, Typography, Card, Table, Tag, Modal, Button, message, Timeline } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { CloseCircleFilled, CloseOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Lấy dữ liệu đơn hàng từ localStorage
        const savedOrders = localStorage.getItem("orders");
        if (savedOrders) {
            try {
                const parsedOrders = JSON.parse(savedOrders);
                setOrders(parsedOrders);
            } catch (error) {
                console.error("Lỗi khi phân tích dữ liệu đơn hàng:", error);
            }
        }
        setLoading(false);
    }, []);

    const handleCancelOrder = async (trackingOrder) => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/proxy/shipment/cancel/${trackingOrder}`,
                {},

            );

            if (response.data.success) {
                message.success("Hủy đơn hàng thành công!");
                // Cập nhật trạng thái đơn hàng trong localStorage
                const updatedOrders = orders.map(order => {
                    if (order.trackingOrder === trackingOrder) {
                        return { ...order, status: 'cancelled' };
                    }
                    return order;
                });
                setOrders(updatedOrders);
                localStorage.setItem("orders", JSON.stringify(updatedOrders));
            } else {
                message.error("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
            }
        } catch (error) {
            console.error("Lỗi khi hủy đơn hàng:", error);
            message.error("Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại sau.");
        }
    };

    const handleTrackingOrder = async (order) => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/proxy/shipment/track/${order.trackingOrder}`
            );

            console.log("Response từ API:", response.data);

            if (response.data.success && response.data.order) {
                const trackingInfo = response.data.order;
                console.log("Tracking info:", trackingInfo);

                Modal.info({
                    title: "Thông tin theo dõi đơn hàng",
                    width: 800,
                    content: (
                        <div>
                            <div style={{ marginBottom: '20px' }}>
                                <h3>Thông tin vận đơn</h3>
                                <p><strong>Mã vận đơn:</strong> {trackingInfo?.label_id || 'N/A'}</p>
                                <p><strong>Trạng thái:</strong> {
                                    trackingInfo?.status === -1 ? 'Đã Hủy' :
                                        trackingInfo?.status === 1 ? 'Chưa tiếp nhận' :
                                            trackingInfo?.status === 2 ? 'Đã tiếp nhận' :
                                                trackingInfo?.status === 12 ? 'Đang lấy hàng' :
                                                    trackingInfo?.status || 'N/A'
                                }</p>
                                <p><strong>Địa chỉ giao hàng:</strong> {trackingInfo?.address || 'N/A'}</p>
                                <p><strong>Ngày tạo:</strong> {trackingInfo?.created ? new Date(trackingInfo.created).toLocaleString('vi-VN') : 'N/A'}</p>
                                <p><strong>Ngày giao hàng dự kiến:</strong> {trackingInfo?.deliver_date ? new Date(trackingInfo.deliver_date).toLocaleString('vi-VN') : 'N/A'}</p>
                            </div>

                            <div>
                                <h3>Thông tin sản phẩm</h3>
                                {trackingInfo?.products && Array.isArray(trackingInfo.products) && trackingInfo.products.length > 0 ? (
                                    trackingInfo.products.map((product, index) => (
                                        <div key={index} style={{ marginBottom: '10px' }}>
                                            <p><strong>Tên sản phẩm:</strong> {product.full_name || 'N/A'}</p>
                                            <p><strong>Mã sản phẩm:</strong> {product.product_code || 'N/A'}</p>
                                            <p><strong>Số lượng:</strong> {product.quantity || 'N/A'}</p>
                                            <p><strong>Khối lượng:</strong> {product.weight + 'kg' || 'N/A'}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>Không có thông tin sản phẩm</p>
                                )}
                            </div>

                            <div>
                                <h3>Thông tin khác</h3>
                                <p><strong>Phí vận chuyển:</strong> {trackingInfo?.ship_money ? new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(trackingInfo.ship_money) : 'N/A'}</p>
                                <p><strong>Tiền thu hộ:</strong> {trackingInfo?.pick_money ? new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(trackingInfo.pick_money) : 'N/A'}</p>
                                <p><strong>Bảo hiểm:</strong> {trackingInfo?.insurance ? new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(trackingInfo.insurance) : 'N/A'}</p>
                            </div>
                        </div>
                    ),
                });
            } else {
                console.log("Dữ liệu không hợp lệ:", response.data);
                message.error("Không tìm thấy thông tin theo dõi đơn hàng. Vui lòng thử lại sau.");
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin theo dõi đơn hàng:", error);
            message.error("Có lỗi xảy ra khi lấy thông tin theo dõi đơn hàng. Vui lòng thử lại sau.");
        }
    };

    const columns = [
        {
            title: "Mã vận đơn GHTK",
            dataIndex: "trackingOrder",
            key: "trackingOrder",
        },
        {
            title: "Ngày đặt",
            dataIndex: "orderDate",
            key: "orderDate",
        },
        {
            title: "Tổng tiền",
            dataIndex: "total",
            key: "total",
            render: (total) => (
                new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(total)
            ),
        },
        {
            title: "Phương thức thanh toán",
            dataIndex: "payment_method",
            key: "payment_method",
            render: (method) => (
                <Tag color={method === "cod" ? "blue" : "green"}>
                    {method === "cod" ? "Thanh toán khi nhận hàng (COD)" : "Thanh toán qua VNPay"}
                </Tag>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={status === 'cancelled' ? 'red' : 'green'}>
                    {status === 'cancelled' ? 'Đã hủy' : 'Đang xử lý'}
                </Tag>
            ),
        },
        {
            key: "action",
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <a onClick={() => showOrderDetails(record)}>Xem chi tiết</a>
                    <a onClick={() => handleTrackingOrder(record)}>Theo dõi đơn hàng</a>
                    {!record.status && (
                        <CloseCircleFilled
                            type="link"
                            danger
                            onClick={() => {
                                Modal.confirm({
                                    title: 'Xác nhận hủy đơn hàng',
                                    content: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
                                    okText: 'Có',
                                    cancelText: 'Không',
                                    onOk: () => handleCancelOrder(record.trackingOrder),
                                });
                            }}
                        >
                            HỦY
                        </CloseCircleFilled>
                    )}
                </div>
            ),
        },
    ];

    const showOrderDetails = (order) => {
        // Hiển thị modal với chi tiết đơn hàng
        Modal.info({
            title: "Chi tiết đơn hàng",
            width: 800,
            content: (
                <div>
                    <div className="order-info">
                        <h3>Thông tin giao hàng</h3>
                        <p><strong>Họ và tên:</strong> {order.full_name}</p>
                        <p><strong>Số điện thoại:</strong> {order.tel}</p>
                        <p><strong>Địa chỉ:</strong> {order.address}</p>
                        {order.note && <p><strong>Ghi chú:</strong> {order.note}</p>}
                    </div>

                    <div className="order-items">
                        <h3>Sản phẩm đã đặt</h3>
                        {order.items.map((item, index) => (
                            <div key={index} className="order-item">
                                <img src={item.image} alt={item.name} style={{ width: 50, marginRight: 10 }} />
                                <div>
                                    <p><strong>{item.name}</strong></p>
                                    <p>Số lượng: {item.quantity}</p>
                                    <p>
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(item.price)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ),
        });
    };

    return (
        <Layout className="order-history-page">
            <Content className="order-history-content">
                <Title level={2}>Lịch sử đơn hàng</Title>
                <Card>
                    <Table
                        columns={columns}
                        dataSource={orders}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                    />
                </Card>
            </Content>
        </Layout>
    );
};

export default OrderHistoryPage; 