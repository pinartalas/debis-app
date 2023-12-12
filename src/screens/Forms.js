import React, { useEffect } from 'react';
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { apiConstant } from '../apiCrud/apiConstant';
import { GetAxios, PostAxios } from '../apiCrud/crud';
import InvoiceFlat from '../components/InfoiceFlat';
import Loading from '../components/loading';
import { Dialog } from 'react-native-paper';
import FromFlat from '../components/FromFlat';
import { Picker } from '@react-native-picker/picker';
import SearchableDropDown from 'react-native-searchable-dropdown';
function FormsScreen(props) {
    const [pageNumber, setPageNumber] = React.useState(1);
    const [listData, setListData] = React.useState([]);
    const [transData, setTransData] = React.useState(false);
    const [totalData, setTotalData] = React.useState(0);
    const [dataLoading, setDataLoading] = React.useState(false);
    const [isPageLoadData, setIsPagaLoadData] = React.useState(true);
    const [detailShow, setDetailShow] = React.useState(false);
    const [detailItem, setDetailItem] = React.useState({});
    const [companyType, setCompanyType] = React.useState([]);
    const [formCreateModel, setFromCreateModel] = React.useState({});


    useEffect(() => { getAllData() }, [])
    const create = async () => {
        var cprop = await PostAxios(apiConstant.BaseUrl + "/api/Company/Create", formCreateModel).then(x => { return x.data }).catch(x => { return x });

        getAllData();
    }

    const getAllData = async (first = true) => {
        if (first === true) {
            //  setPageNumber(1)
            setListData([])
        }
        setTransData(true)
        setDataLoading(true)

        var cprop = await GetAxios(apiConstant.BaseUrl + "/api/Company/GetCompanyType").then(x => { return x.data }).catch(x => { return x });

        setCompanyType(cprop.data)


        var d = []
        if (isPageLoadData == false) {
            d = await PostAxios(apiConstant.BaseUrl + "/api/Company/GetByCurrentUserPager", {
                "pageNumber": first == true ? 1 : pageNumber + 1,
                "pageSize": 10,

            }).then(x => { return x.data }).catch(x => { return x });
        } else {

            d = await PostAxios(apiConstant.BaseUrl + "/api/Company/GetByCurrentUserPager", {
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
    return (<>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity onPress={() => setDetailShow(true)} style={{ backgroundColor: "#1565C0", padding: 10, marginTop: 10, marginBottom: 10 }}>
                <Text style={{ color: "white" }}>Yeni Form</Text>
            </TouchableOpacity>

        </View>

        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>


            <FlatList
                data={listData}
                renderItem={({ item }) => <FromFlat  setDetailShow={setDetailShow} setDetailItem={setDetailItem} key={item.id} item={item} prp={props} />}
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




        </View>
        <Dialog visible={detailShow} style={{ borderRadius: 10, padding: 5, marginTop: -250, justifyContent: "center", alignItems: "center" }}>
            <View style={{ maxHeight: 400, width: "100%" }}>

                {/* <View>
                    <Text style={{ fontWeight: "bold", color: "#2E7D32", fontSize: 16 }}> Oluştur </Text>
                </View> */}



                <View style={{ flexDirection: "column", marginTop: 10 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}> Form Türü </Text>
                    <SearchableDropDown
                        onItemSelect={(item) => {


                            setFromCreateModel({ ...formCreateModel, companyTypeId: item.id })

                        }}


                        containerStyle={{ padding: 5 }}
                        selectedItems={companyType.find(x => { return x.id == formCreateModel.companyTypeId })}
                        itemStyle={{
                            padding: 10,
                            marginTop: 2,
                            backgroundColor: '#ddd',
                            borderColor: '#bbb',
                            borderWidth: 1,
                            borderRadius: 5,
                        }}

                        itemTextStyle={{ color: '#222' }}
                        itemsContainerStyle={{ maxHeight: 140 }}
                        items={companyType}

                        resetValue={false}
                        textInputProps={
                            {
                                placeholder: "Firma Yetkilisi Ara",
                                underlineColorAndroid: "Firma Yetkilisi Ara",
                                style: {
                                    padding: 12,
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 5,
                                },


                                onTextChange: text => {
                                    if (text.length >= 2) {

                                    }

                                }
                            }
                        }
                        listProps={
                            {
                                nestedScrollEnabled: false,
                            }
                        }
                    />
                </View>

                <View style={{ flexDirection: "column", marginTop: 10 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 16 }}> Form Adı </Text>
                    <TextInput
                        onChangeText={(x) => { setFromCreateModel({ ...formCreateModel, name: x }) }}
                        style={{
                            fontSize: 14,
                            borderStyle: "solid",
                            borderColor: "grey",
                            borderWidth: 1,
                            margin: 5,
                            padding: 10
                        }}> </TextInput>
                </View>



            </View>


            <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 30, paddingBottom: 5 }}>
                <TouchableOpacity onPress={() => {
                    if (!formCreateModel.name || !formCreateModel.companyTypeId) {
                        alert("Kayıt Yapılmadı. Gösterilen Alanları Doldurun")
                        return false;
                    }
                    setDetailShow(false); create()
                }} style={{ backgroundColor: "green", width: 100, justifyContent: "center" }}><Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 16, padding: 8 }}>Kaydet</Text></TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    setDetailShow(false);
                }} style={{ backgroundColor: "red", width: 100, justifyContent: "center" }}><Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 16, padding: 8 }}>Vazgeç</Text></TouchableOpacity>



            </View>
        </Dialog>
    </>
    );
}

export default FormsScreen;