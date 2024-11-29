
import React, { useEffect, useState } from 'react';



import { Text, View, TextInput, ScrollView, Button, Image, TouchableOpacity, Dimensions, SafeAreaView, Platform } from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { FlatList, Switch } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import { GetAxios, PostAxios } from '../apiCrud/crud';
import { apiConstant } from '../apiCrud/apiConstant';
import Loading from './loading';
import SearchableDropDown from 'react-native-searchable-dropdown';
import DatePicker from './DatePicker';
import moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
import Icon from "react-native-vector-icons/FontAwesome";
export default function CompanyProperty({ changeTopic, companyName, companyType, companyId, setHideLabel, setProperty, properties = [], hideLabel, setListProperty, formName }) {

    const [refresh, setRefresh] = useState()
    const [valueById, setValueById] = useState([]);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [personelList, setPersonelList] = useState([]);
    const [allCustomerData, setAllCustomerData] = useState([]);
    const [customerOption, setCustomerOption] = useState([]);

    const [selectedCustomer, setSelectedCustomer] = useState();


    const [status, requestPermission] = ImagePicker.useCameraPermissions();
    const changeVal = (val, propId, isUpload = false) => {
        var dd = valueById.filter(x => { return x.id != propId })
        dd.push({ id: propId, value: val, isUpload: isUpload })
        setValueById(dd);

    }
    const start = async () => {
        var d = await GetAxios(apiConstant.BaseUrl + "/api/Company/GetPropertyList/" + companyId).then(x => { return x.data }).catch(x => { return x });

        var dataFlt = []
        for (const item of d.data) {
            if (item.isUpload) {
                item.value = apiConstant.IMAGEBASEURL + "/" + item.value
            }
            dataFlt.push(item)
        }

        setValueById(dataFlt);

    }

    const getPersonByName = async (name) => {
        var d = await PostAxios(apiConstant.BaseUrl + "/api/debisPersonel/getActivePersonelbyname", { key: name }).then(x => { return x.data }).catch(x => { return x });


        setPersonelList(d.data.map((item, key) => { return { name: item.ad + " " + item.soyad, id: item.ad + " " + item.soyad } }));

    }



    const getCustomerByName = async (name) => {
        var d = await PostAxios(apiConstant.BaseUrl + "/api/debiscompany/getactivecustomersbyname", { key: name }).then(x => { return x.data }).catch(x => { return x });

        setAllCustomerData(d.data)
        setCustomerOption(d.data.map((item, key) => { return { name: item.name, id: item.name } }));

    }

    const pickImage = async (propId) => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            quality: 1,
            base64: true
        });

        if (!result.canceled) {
            changeVal("data:image/png;base64," + result.assets[0].base64, propId, true)
        }
    };

    const save = async () => {
        console.log(valueById)
        setLoading(true)
        var d = await PostAxios(apiConstant.BaseUrl + "/api/Company/SetPropertyList", {
            companyId: companyId,
            list: valueById
    
        }).then(x => { return x.data }).catch(x => { return x });
        setLoading(false)

    };
    useEffect(() => {


        setRefresh(new Date())
        start()
    }, [setHideLabel, setProperty, properties, hideLabel])



    return (
        <View style={{ height: "100%" }}>
            <View style={{ flex: 1, justifyContent: "space-between", alignItems: "center", flexDirection: "row", backgroundColor: "#DCEDC8", borderBottomColor: "#616161", borderBottomWidth: 2 }}>
                <View style={{ paddingLeft: 10, justifyContent: "center", flex: 1 }}>
                    <Text style={{ fontWeight: "bold", textAlign: "center", fontSize: 16 }}>
                        {companyType}
                    </Text>
                    <Text style={{ textAlign: "center", fontSize: 16 }}>
                        ({companyName} )
                    </Text>
                </View>



            </View>

            <View style={{ flex: 6, paddingTop: 15, paddingRight: 15, paddingLeft: 10 }}>
                <FlatList
                    keyboardShouldPersistTaps="always"
                    style={{ backgroundColor: "#ECEFF1" }}
                    data={properties}
                    
                    renderItem={({ item }) => {

                        if (item.companyPropertyValueType === 1) {
                            return (
                                <View key={item.id}>
                                    <View style={{ position: "relative", marginBottom: 10 }}>
                                        <FloatingLabelInput
                                            label={item.key}
                                            inputMode="text"
                                            value={valueById.find((x) => x.id === item.id)?.value}
                                            onChangeText={(val) => {
                                                changeVal(val, item.id, false);
                                                setHideLabel();
                                            }}
                                        />
                                    </View>
                                </View>
                            );
                        }

                        if (item.companyPropertyValueType === 2) {
                            return (
                                <View key={item.id} style={{ marginBottom: 10 }}>
                                    <View style={{ position: "relative" }}>
                                        <FloatingLabelInput
                                            label={item.key}
                                            inputMode="numeric"
                                            value={valueById.find((x) => x.id === item.id)?.value}
                                            onChangeText={(val) => {
                                                changeVal(val, item.id, false);
                                                setHideLabel();
                                            }}
                                        />
                                    </View>
                                </View>
                            );
                        }

                        if (item.companyPropertyValueType === 7) {
                            return (
                                <View key={item.id}>
                                    <View
                                        style={{
                                            position: "relative",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            marginBottom: 20,
                                            marginTop: 10,
                                        }}
                                    >
                                        <Text style={{ marginRight: 10, fontWeight: "bold", fontSize: 14 }}>
                                            {item.key}
                                        </Text>
                                        <DatePicker
                                            value={
                                                (valueById.find((x) => x.id === item.id)?.value &&
                                                    new Date(valueById.find((x) => x.id === item.id)?.value)) ||
                                                new Date()
                                            }
                                            onChange={(e, d) => {
                                                changeVal(d, item.id, false);
                                                setHideLabel();
                                            }}
                                        ></DatePicker>
                                    </View>
                                </View>
                            );
                        }

                        if (item.companyPropertyValueType === 5) {
                            return (
                                <SafeAreaView key={item.id}>
                                    <Text> {item.key}</Text>
                                    <View
                                        style={{
                                            position: "relative",
                                            borderColor: "#B0BEC5",
                                            borderWidth: 1,
                                            borderStyle: "solid",
                                            marginTop: 10,
                                            marginBottom: 20,



                                        }}
                                    >

                                        {Platform.OS == "android" && <RNPickerSelect
                                            onValueChange={(itm) => {

                                                changeVal(itm, item.id, false);
                                                setHideLabel();
                                            }}
                                            items={item?.propertySelectLists.map((jitem) => {
                                                return { value: jitem.item, label: jitem.item };
                                            })}

                                            value={valueById.find((x) => x.id === item.id)?.value}


                                            placeholder={{ value: null, label: "Seçiniz" }}
                                        />}
                                        {Platform.OS == "ios" && <RNPickerSelect
                                            onValueChange={(itm) => {

                                                changeVal(itm, item.id, false);
                                                setHideLabel();
                                            }}
                                            Icon={() => <Icon size={15} style={{ marginRight: 10 }} color={"black"} name='chevron-down'></Icon>}
                                            style={{ viewContainer: { height: 40, justifyContent: "center", paddingLeft: 10 } }}
                                            items={item?.propertySelectLists.map((jitem) => {
                                                return { value: jitem.item, label: jitem.item };
                                            })}

                                            value={valueById.find((x) => x.id === item.id)?.value}


                                            placeholder={{ value: null, label: "Seçiniz" }}
                                        />}

                                    </View>
                                </SafeAreaView>
                            );
                        }

                        if (item.companyPropertyValueType === 8) {
                            return (
                                <View key={item.id}>
                                    <Text> {item.key}</Text>
                                    <View style={{ position: "relative", paddingBottom: 30 }}>
                                        <SearchableDropDown
                                            onItemSelect={(itm) => {
                                                changeVal(itm.name, item.id, false);
                                                setHideLabel();
                                            }}
                                            containerStyle={{ padding: 5 }}
                                            itemStyle={{
                                                padding: 10,
                                                marginTop: 2,
                                                backgroundColor: "#ddd",
                                                borderColor: "#bbb",
                                                borderWidth: 1,
                                                borderRadius: 5,
                                            }}
                                            selectedItems={[
                                                {
                                                    name: valueById.find((x) => x.id === item.id)?.value,
                                                    id: valueById.find((x) => x.id === item.id)?.value,
                                                },
                                            ]}
                                            itemTextStyle={{ color: "#222" }}
                                            itemsContainerStyle={{ maxHeight: 140 }}
                                            items={personelList}
                                            textInputProps={{
                                                defaultValue: valueById.find((x) => x.id === item.id)?.value,
                                                placeholder: "Seç",
                                                underlineColorAndroid: "Seç",
                                                style: {
                                                    padding: 12,
                                                    borderWidth: 1,
                                                    borderColor: "#ccc",
                                                    borderRadius: 5,
                                                },
                                                onTextChange: (text) => {
                                                    if (text?.length >= 2) {
                                                        getPersonByName(text);
                                                    }
                                                },
                                            }}
                                            listProps={{
                                                nestedScrollEnabled: false,
                                            }}
                                        />
                                    </View>
                                </View>
                            );
                        }

                        if (item.companyPropertyValueType === 9) {
                            return (

                                <SafeAreaView key={item.id} style={{ marginBottom: 59 }}>
                                    <Text> {item.key}</Text>
                                    <View style={{ position: "relative", paddingBottom: 20 }}>





                                        <SearchableDropDown
                                            onItemSelect={(itm) => {
                                                changeVal(itm.name, item.id, false);
                                                setHideLabel();

                                                var address = properties.find(
                                                    (x) => x.companyPropertyValueType === 12
                                                );
                                                var Phone = properties.find(
                                                    (x) => x.companyPropertyValueType === 13
                                                );
                                                var ePosta = properties.find(
                                                    (x) => x.companyPropertyValueType === 14
                                                );

                                                changeTopic("customer", itm.name);
                                                let slc = allCustomerData?.find((x) => x.name === itm.name);

                                                if (slc !== undefined) {
                                                    setSelectedCustomer(slc);
                                                    changeTopic("customerEmail", slc.employerEmail);
                                                    changeTopic("customerAddress", slc.address);
                                                    changeTopic("customerTel", slc.employerTel);

                                                    address && changeVal(slc.address, address.id);
                                                    Phone && changeVal(slc.employerTel, Phone.id);
                                                    ePosta && changeVal(slc.employerEmail, ePosta.id);
                                                }
                                                changeVal(itm.name, item.id, false);
                                            }}
                                            containerStyle={{ padding: 5 }}
                                            itemStyle={{
                                                padding: 10,
                                                marginTop: 2,
                                                backgroundColor: "#ddd",
                                                borderColor: "#bbb",
                                                borderWidth: 1,
                                                borderRadius: 5,
                                            }}

                                            selectedItems={{
                                                name: valueById.find((x) => x.id === item.id)?.value,
                                                id: valueById.find((x) => x.id === item.id)?.value,
                                            }}
                                            itemTextStyle={{ color: "#222" }}
                                            itemsContainerStyle={{ maxHeight: 140 }}
                                            items={customerOption}
                                            textInputProps={{
                                                defaultValue: valueById.find((x) => x.id === item.id)?.value,
                                                placeholder: "Seç",
                                                underlineColorAndroid: "Seç",
                                                style: {
                                                    padding: 12,
                                                    borderWidth: 1,
                                                    borderColor: "#ccc",
                                                    borderRadius: 5,
                                                },
                                                onTextChange: (text) => {
                                                    if (text?.length >= 2) {
                                                        getCustomerByName(text);
                                                    }
                                                },
                                            }}
                                            listProps={{
                                                nestedScrollEnabled: false,
                                            }}
                                        />
                                    </View>
                                    {selectedCustomer && (
                                        <>
                                            <View style={{ fontSize: 11, flexDirection: "row" }}>
                                                <Text style={{ fontWeight: "bold" }}>Adres: </Text>
                                                <Text>{selectedCustomer?.address || "-"}</Text>
                                            </View>
                                            <View style={{ fontSize: 11, flexDirection: "row" }}>
                                                <Text style={{ fontWeight: "bold" }}>Telefon: </Text>
                                                <Text>{selectedCustomer?.employerTel || "-"}</Text>
                                            </View>
                                            <View style={{ fontSize: 11, flexDirection: "row" }}>
                                                <Text style={{ fontWeight: "bold" }}>E-posta: </Text>
                                                <Text> {selectedCustomer?.employerEmail || "-"}</Text>
                                            </View>
                                        </>
                                    )}
                                    {!selectedCustomer && (
                                        <>
                                            <View style={{ fontSize: 11, flexDirection: "row" }}>
                                                <Text style={{ fontWeight: "bold" }}>Adres: </Text>
                                                <Text>
                                                    {" "}
                                                    {properties.find((x) => x.companyPropertyValueType === 12)
                                                        ?.companyPropertyValues?.value || "-"}
                                                </Text>
                                            </View>
                                            <View style={{ fontSize: 11, flexDirection: "row" }}>
                                                <Text style={{ fontWeight: "bold" }}>Telefon: </Text>
                                                <Text>
                                                    {" "}
                                                    {properties.find((x) => x.companyPropertyValueType === 13)
                                                        ?.companyPropertyValues?.value || "-"}
                                                </Text>
                                            </View>
                                            <View style={{ fontSize: 11, flexDirection: "row" }}>
                                                <Text style={{ fontWeight: "bold" }}>E-posta: </Text>
                                                <Text>
                                                    {" "}
                                                    {properties.find((x) => x.companyPropertyValueType === 14)
                                                        ?.companyPropertyValues?.value || "-"}
                                                </Text>
                                            </View>
                                        </>
                                    )}
                                </SafeAreaView>
                            );
                        }

                        if (item.companyPropertyValueType === 10) {
                            let selectedCustomerProjct =
                                selectedCustomer?.customerProjects?.map((x) => {
                                    return { name: x.name, id: x.name };
                                }) || [];

                            return (
                                <View key={item.id} >
                                    <Text> {item.key}</Text>
                                    <View style={{ position: "relative", paddingBottom: 30 }}>
                                        <SearchableDropDown
                                            onItemSelect={(itm) => {
                                                changeVal(itm.name, item.id, false);
                                                setHideLabel();
                                                changeTopic("customerProject", itm.name);
                                            }}
                                            containerStyle={{ padding: 5 }}
                                            itemStyle={{
                                                padding: 10,
                                                marginTop: 2,
                                                backgroundColor: "#ddd",
                                                borderColor: "#bbb",
                                                borderWidth: 1,
                                                borderRadius: 5,
                                            }}
                                          
                                            selectedItems={{
                                                name: valueById.find((x) => x.id === item.id)?.value,
                                                id: valueById.find((x) => x.id === item.id)?.value,
                                            }}
                                            itemTextStyle={{ color: "#222" }}
                                            itemsContainerStyle={{ maxHeight: 140 }}
                                            items={selectedCustomerProjct}
                                            textInputProps={{
                                                defaultValue: valueById.find((x) => x.id === item.id)?.value,
                                                placeholder: "Seç",
                                                underlineColorAndroid: "Seç",
                                                style: {
                                                    padding: 12,
                                                    borderWidth: 1,
                                                    borderColor: "#ccc",
                                                    borderRadius: 5,
                                                },
                                                onTextChange: (text) => {
                                                    if (text?.length >= 2) {
                                                        // getCustomerByName(text);
                                                    }
                                                },
                                            }}
                                            listProps={{
                                                nestedScrollEnabled: false,
                                            }}
                                        />
                                    </View>
                                </View>
                            );
                        }

                        if (item.companyPropertyValueType === 4) {
                            return (
                                <View key={item.id} style={{ marginBottom: 10 }}>
                                    <View style={{ position: "relative", marginBottom: 10 }}>
                                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                            <Text style={{ marginRight: 5 }}>{item.key}</Text>
                                            <Switch
                                                trackColor={{ false: "red", true: "green" }}
                                                thumbColor={false ? "#f5dd4b" : "#f4f3f4"}
                                                ios_backgroundColor="#3e3e3e"
                                                onValueChange={(val) => {
                                                   console.log(val)
                                                    changeVal(val, item.id, false);
                                                    setHideLabel();
                                                }}
                                                
                                                value={valueById.find((x) => x.id === item.id)?.value === true||valueById.find((x) => x.id === item.id)?.value === "True"}
                                            />
                                            {/* <Text>{JSON.stringify( valueById.find((x) => x.id === item.id)?.value)}</Text> */}
                                        </View>
                                    </View>
                                </View>
                            );
                        }

                        if (item.companyPropertyValueType === 6) {
                            return (
                                <View
                                    key={item.id}
                                    style={{
                                        backgroundColor: "#B2DFDB",
                                        marginBottom: 10,
                                        padding: 10,
                                        borderColor: "#26A69A",
                                        borderWidth: 1,
                                        borderStyle: "solid",
                                    }}
                                >
                                    <Text style={{ fontWeight: "bold" }}>{item.key} </Text>
                                    <View cla style={{ position: "relative" }}>
                                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                            <Button title="Galeriden Resim Seç" onPress={() => pickImage(item.id)} />
                                            {valueById.find((x) => x.id === item.id)?.value && (
                                                <Image source={{ uri: valueById.find((x) => x.id === item.id)?.value }} style={{ width: 200, height: 200 }} />
                                            )}
                                        </View>
                                    </View>
                                </View>
                            );
                        }

                        return null; // Eğer yukarıdaki şartlardan hiçbiri sağlanmıyorsa null döndür
                    }}
                />

            </View>
            {loading && <View style={{ paddingTop: 50, position: "absolute", backgroundColor: "#ffffffc2", height: "100%", width: "100%", flexDirection: "column", alignItems: "center" }}>
                <Loading height={50} width={50}></Loading>
                <View>
                    <Text>Kaydediliyor</Text>

                </View>
            </View>}
            <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => { save() }} style={{ backgroundColor: "green", padding: 10, marginBottom: 28, flexDirection: "row", flex: 1, justifyContent: "center" }}>

                    <Text style={{ fontWeight: "bold", color: "white", marginLeft: 10, textAlign: "center", marginTop: 8, fontSize: 18 }}>

                        Kaydet</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
