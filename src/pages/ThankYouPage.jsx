import { useLocation, Link } from "react-router-dom";
import { Layout, Typography, Button, Card, Result, message } from "antd";
import {
  CheckCircleOutlined,
  HomeOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../components/AppLayout";
import "./ThankYouPage.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const { Content } = Layout;
const { Title, Text } = Typography;

const ThankYouPage = () => {
  const location = useLocation();
  const { setCartItems } = useContext(CartContext);
  const [orderData, setOrderData] = useState(location.state?.orderData || null);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const uuid = uuidv4();
  useEffect(() => {
    if (orderData) {
      const payload = {
        products: orderData.items.map((item) => ({
          name: item.name,
          weight: item.weight || 0.1,
          quantity: item.quantity,
          product_code: item.id,
        })),
        order: {
          id: uuid,
          pick_name: "Châu Nguyễn Trường An",
          pick_money: 0,
          pick_address: "nhà số 170/1 Nguyễn Thị Mười",
          pick_province: "Thành Phố Hồ Chí Minh",
          pick_district: "Quận 8",
          pick_tel: "0783891752",
          name: orderData.full_name,
          address: orderData.address,
          province: orderData.province,
          district: orderData.district,
          ward: orderData.ward,
          street: orderData.street,
          hamlet: "Khác",
          tel: orderData.tel,
          email: orderData.email,
          return_name: "Châu Nguyễn Trường An",
          return_address: "nhà số 170/1",
          return_provice: "Thành Phố Hồ Chí Minh",
          return_ward: "Quận 8",
          return_tel: "0783891752",
          return_email: "anchau03102003@gmail.com",
          value: orderData.total,
        },
      };

      console.log("Payload gửi đi:", payload);

      axios
        .post("http://localhost:8080/api/proxy/shipment/order", payload, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("Response từ server proxy:", response.data);
          if (response.data.success && response.data.order) {
            const trackingInfo = response.data.order;
            console.log("Tracking info:", trackingInfo);

            // Lưu thông tin tracking nếu cần
            localStorage.setItem(
              "tracking_order",
              response.data.order.tracking_id
            );
            console.log("Tracking order từ GHTK:", response.data.order.tracking_id);
            setTrackingOrder(response.data.order.tracking_id);

            // Lưu thông tin đơn hàng vào localStorage
            const savedOrders = localStorage.getItem("orders");
            const orders = savedOrders ? JSON.parse(savedOrders) : [];
            const newOrder = {
              ...orderData,
              id: uuid,
              trackingOrder: response.data.order.tracking_id,
              orderDate: new Date().toISOString(),
              ghtkInfo: {
                label_id: trackingInfo.label_id,
                date_to_delay_deliver: trackingInfo.date_to_delay_deliver,
                date_to_delay_pick: trackingInfo.date_to_delay_pick,
                estimated_deliver_time: trackingInfo.estimated_deliver_time,
                estimated_pick_time: trackingInfo.estimated_pick_time,
                fee: trackingInfo.fee,
                insurance_fee: trackingInfo.insurance_fee,
                is_xfast: trackingInfo.is_xfast,
                ship_money: trackingInfo.ship_money,
                pick_money: trackingInfo.pick_money,
                products: trackingInfo.products
              }
            };
            orders.push(newOrder);
            localStorage.setItem("orders", JSON.stringify(orders));
          }
        })
        .catch((error) => {
          console.error(
            "Lỗi khi gửi đơn hàng:",
            error.response ? error.response.data : error.message
          );
        });
    }
  }, [orderData]);

  useEffect(() => {
    if (!orderData) {
      const savedOrderData = localStorage.getItem("orderData");
      if (savedOrderData) {
        try {
          const parsedData = JSON.parse(savedOrderData);
          setOrderData(parsedData);
          // Xóa dữ liệu sau khi đã sử dụng
          localStorage.removeItem("orderData");
        } catch (error) {
          console.error("Lỗi khi phân tích dữ liệu đơn hàng:", error);
        }
      }
    }

    // Lấy tracking order từ localStorage

  }, [orderData]);

  // Kiểm tra nếu có tham số vnp_ResponseCode = 00 (thanh toán thành công)
  // và đảm bảo giỏ hàng được xóa khi vào trang thank-you
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const vnpResponseCode = urlParams.get("vnp_ResponseCode");

    if (vnpResponseCode === "00") {
      message.success("Thanh toán thành công!");
    }

    // Đảm bảo giỏ hàng được xóa khi vào trang thank-you,
    // ngay cả khi người dùng truy cập trực tiếp thông qua URL
    setCartItems([]);
    localStorage.removeItem("cartFormData");
  }, [setCartItems]);

  if (!orderData) {
    return (
      <Layout className="thank-you-page">
        <Content className="thank-you-content">
          <Result
            status="warning"
            title="Không tìm thấy thông tin đơn hàng"
            subTitle="Đơn hàng của bạn có thể đã được xử lý, nhưng không thể hiển thị chi tiết"
            extra={[
              <Link to="/" key="home">
                <Button type="primary" icon={<HomeOutlined />}>
                  Về trang chủ
                </Button>
              </Link>,
              <Link to="/cart" key="cart">
                <Button icon={<ShoppingOutlined />}>Giỏ hàng</Button>
              </Link>,
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
              <Text strong>Mã vận đơn GHTK:</Text>
              <Text>{trackingOrder || "Đang xử lý"}</Text>
            </div>
            <div className="info-row">
              <Text strong>Ngày đặt:</Text>
              <Text>{new Date().toLocaleDateString("vi-VN")}</Text>
            </div>
            <div className="info-row">
              <Text strong>Phương thức thanh toán:</Text>
              <Text>
                {orderData.payment_method === "cod"
                  ? "Thanh toán khi nhận hàng (COD)"
                  : "Thanh toán qua VNPay"}
              </Text>
            </div>
            <div className="info-row">
              <Text strong>Tổng tiền:</Text>
              <Text>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(orderData.total)}
              </Text>
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
                  <Text>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.price)}
                  </Text>
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
