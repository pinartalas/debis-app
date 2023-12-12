import React, { useEffect } from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { apiConstant } from '../apiCrud/apiConstant';
import { PostAxios } from '../apiCrud/crud';
import InvoiceFlat from '../components/InfoiceFlat';
import Loading from '../components/loading';
import { Dialog } from 'react-native-paper';


function InvoicesScreen(props) {
    const [pageNumber, setPageNumber] = React.useState(1);
    const [listData, setListData] = React.useState([]);
    const [transData, setTransData] = React.useState(false);
    const [totalData, setTotalData] = React.useState(0);
    const [dataLoading, setDataLoading] = React.useState(false);
    const [isPageLoadData, setIsPagaLoadData] = React.useState(true);
    const [detailShow, setDetailShow] = React.useState(false);
    const [detailItem, setDetailItem] = React.useState({});

    useEffect(() => { getAllData() }, [])
    const getAllData = async (first = true) => {
        if (first === true) {
            //  setPageNumber(1)
            setListData([])
        }
        setTransData(true)
        setDataLoading(true)

        var d = []
        if (isPageLoadData == false) {
            d = await PostAxios(apiConstant.BaseUrl + "/api/DebisInvoice/GetInvoice", {
                "pageNumber": first == true ? 1 : pageNumber + 1,
                "pageSize": 10,

            }).then(x => { return x.data }).catch(x => { return x });
        } else {

            d = await PostAxios(apiConstant.BaseUrl + "/api/DebisInvoice/GetInvoice", {
                pageNumber: first == true ? 1 : pageNumber + 1,
                pageSize: 10,

            }).then(x => { return x.data }).catch(x => { return x });
        }
        var ll = listData;
        setTotalData(d.data.totalCount)


        d.data.list.forEach(element => {
            ll.push(element)
        });
        setTimeout(() => {
            if (first === true) {
                setListData(d.data.list)

            } else {

                setListData(ll)
                var sas = pageNumber + 1
                setPageNumber(sas)

            }
            setTransData(false)
            setDataLoading(false)
        }, 600);



    };


    const scrollBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
    };
    return (
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "flex-start",flex:1 }}>

            <FlatList
                data={listData}
                renderItem={({ item }) => <InvoiceFlat setDetailShow={setDetailShow} setDetailItem={setDetailItem} key={item.id} item={item} prp={props} />}
                horizontal={false}
                keyExtractor={item => item.id}
                ListEmptyComponent={dataLoading && <View style={{ justifyContent: "center", flexDirection: "row" }}><Loading></Loading></View>}

                numColumns={1}
                onScroll={({ nativeEvent }) => {

                    // if (pageNumber != totalData) {
                    //   setDataLoading(true)
                    // }
                    if (scrollBottom(nativeEvent)) {
                        if (transData == false) {
                            if (pageNumber != totalData) {
                                getAllData(false)
                            }
                        }
                    }
                }}
            />
            <Dialog visible={detailShow} style={{ borderRadius: 10, padding: 5, justifyContent: "center", alignItems: "center" }}>
                <ScrollView style={{maxHeight:400,width:"100%"}}>
                  
                    <View>
                        <Text style={{ fontWeight: "bold", color: "#2E7D32", fontSize: 16 }}> Fatura Detay </Text>
                    </View>
                    <View style={{marginTop:15}}>
                        {detailItem.isSend==1&& <Text style={{backgroundColor:"grey",color:"white",padding:5}}> Muhasebeye Gönderildi</Text>}
                        {detailItem.isSend!=1&& <Text style={{backgroundColor:"red",color:"white",padding:5}}>Muhasebeye Gönderilmedi</Text>}

                    </View>
                    <View style={{marginTop:10}}>
                        {detailItem.isBilled==1&& <Text style={{backgroundColor:"grey",color:"white",padding:5}}> Bu Fatura Kesildi</Text>}
                        {detailItem.isBilled!=1&& <Text style={{backgroundColor:"red",color:"white",padding:5}}>Bu Fatura Kesilmedi</Text>}

                    </View>

                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}> Müşteri : </Text>
                        <Text style={{ fontSize: 14 }}> {detailItem.customerTitle} </Text>
                    </View>
                    <View style={{  flexDirection: "row",marginTop: 10 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}> Vergi Numarası :</Text>
                        <Text style={{ fontSize: 14 }}>{detailItem.taxNumber} </Text>
                    </View>
                    <View style={{  flexDirection: "row",marginTop: 10 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}> Vergi Daires :</Text>
                        <Text style={{ fontSize: 14 }}>{detailItem.taxoffice} </Text>
                    </View>


                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}> Tutar : </Text>
                        <Text style={{ fontSize: 14 }}> {detailItem.amount} </Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 16 }}> Fatura Adresi :</Text>
                        <Text style={{ fontSize: 14 }}>{detailItem.billAdress} </Text>
                    </View>
                  

                </ScrollView>


                <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 30, paddingBottom: 5 }}>
                    <TouchableOpacity onPress={() => setDetailShow(false)} style={{ backgroundColor: "green", width: 100, justifyContent: "center" }}><Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 16, padding: 8 }}>Tamam</Text></TouchableOpacity>

                </View>
            </Dialog>


        </View>
    );
}

export default InvoicesScreen;