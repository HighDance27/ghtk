import { useState } from "react";
import { Drawer } from "antd";

const ViewBookDetail = (props) => {
    const {
        dataDetail, setDataDetail,
        isDetailOpen, setIsDetailOpen } = props;

    return (
        <Drawer
            width={"40vw"}
            title="Book Detail"
            onClose={() => {
                setDataDetail(null);
                setIsDetailOpen(false);
            }}
            open={isDetailOpen}
        >
            {dataDetail ? <>
                <p><span style={{ fontWeight: "bold" }}> Id: </span>
                    {dataDetail.id}</p> <br />
                <p><span style={{ fontWeight: "bold" }}> Tên sản phẩm: </span>
                    {dataDetail.name}</p> <br />
                <p><span style={{ fontWeight: "bold" }}> Giá tiền: </span>{
                    new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    }).format(dataDetail.price)
                }</p>
                <br />
                <p><span style={{ fontWeight: "bold" }}> Số lượng: </span>
                    {dataDetail.inventory}</p> <br />
                <p><span style={{ fontWeight: "bold" }}> Hình ảnh: </span>
                    <div style={{
                        marginTop: "10px",
                        height: "300px",
                        width: "450px",
                        border: "1px solid #ccc"
                    }}>
                        <img style={{ height: "100%", width: "100%", objectFit: "contain" }}
                            src={dataDetail.image}

                        />
                    </div>
                </p> <br />
            </>
                :
                <>
                    <p>No data</p>
                </>
            }
        </Drawer >
    )

}
export default ViewBookDetail;