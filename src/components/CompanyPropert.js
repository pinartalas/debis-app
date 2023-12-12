
import React, { useEffect, useState } from 'react';



import { Text, View, TextInput, ScrollView, Button, Image, TouchableOpacity } from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { Switch } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import { GetAxios, PostAxios } from '../apiCrud/crud';
import { apiConstant } from '../apiCrud/apiConstant';


export default function CompanyProperty({ companyName, companyType, companyId, loading, setHideLabel, setProperty, properties = [], hideLabel, setListProperty, formName }) {

    const [refresh, setRefresh] = useState()
    const [valueById, setValueById] = useState([]);
    const [image, setImage] = useState(null);
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
        console.log(d.data)
    }
 


    const pickImage = async (propId) => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            quality: 1,
            base64: true
        });

        if (!result.canceled) {
            changeVal("data:image/png;base64,"+result.assets[0].base64, propId, true)
        }
    };

    const save = async () => {

        var d = await PostAxios(apiConstant.BaseUrl + "/api/Company/SetPropertyList", {
            companyId: companyId,
            list: valueById

        }).then(x => { return x.data }).catch(x => { return x });

    };
    useEffect(() => {


        setRefresh(new Date())
        start()
    }, [setHideLabel, setProperty, properties, hideLabel])



    return (
        <>
            <View style={{ justifyContent: "space-between", alignItems: "center", flexDirection: "row", backgroundColor: "white" }}>
                <View style={{ paddingLeft: 10, justifyContent: "center" }}>
                    <Text style={{ fontWeight: "bold" }}>
                        {companyType}
                    </Text>
                    <Text>
                        ({companyName} )
                    </Text>
                </View>


                <TouchableOpacity onPress={() => { save() }} style={{ backgroundColor: "green", padding: 15 }}>
                    <Text style={{ fontWeight: "bold", color: "white" }}>Kaydet</Text>
                </TouchableOpacity>
            </View>


            <ScrollView style={{ padding: 20, }} className="row col-12">

                {properties.map((item, key) => {




                    if (item.companyPropertyValueType == 1) {
                        return (<View key={key} >

                            <View style={{ position: "relative", marginBottom: 10 }}>
                                <FloatingLabelInput
                                    label={item.key}
                                    inputMode="text"
                                    value={valueById.find(x => { return x.id == item.id })?.value}
                                    onChangeText={(val) => { console.log(valueById); changeVal(val, item.id, false); setHideLabel(); }}
                                />
                            </View>
                        </View>)
                    }


                    if (item.companyPropertyValueType == 2) {
                        return <View key={key} style={{ marginBottom: 10 }} >
                            <View style={{ position: "relative" }}>

                                <FloatingLabelInput
                                    label={item.key}
                                    inputMode="numeric"
                                    value={valueById.find(x => { return x.id == item.id })?.value}
                                    onChangeText={(val) => { console.log(valueById); changeVal(val, item.id, false); setHideLabel(); }}
                                />

                            </View>
                        </View>
                    }


                    // if (item.companyPropertyValueType == 7) {
                    //     return <View key={key} >
                    //         <View style={{ position: "relative" }}>
                    //             {/* <input style={{ width: "100%" }} defaultValue={item.companyPropertyValues?.value} onBlur={(val) => { setHideLabel(); setProperty(val.target.value, item.id) }} id={item.id} type={"date"}></input> */}
                    //             <TextField required className='dd-date' type={"date"} size='small' style={{ width: "100%" }} defaultValue={item.companyPropertyValues?.value} onBlur={(val) => { setHideLabel(); setProperty(val.target.value, item.id) }} id={item.id} label={item.key} variant="outlined" />


                    //         </View>
                    //     </View>
                    // }

                    // if (item.companyPropertyValueType == 5) {
                    //     return <View key={key} >
                    //         <Text > {item.key}</Text>
                    //         <View style={{ position: "relative" }}>
                    //             {item?.propertySelectLists.map((jitem, jkey) => {

                    //                 return <View key={key} >


                    //                     <View>

                    //                         <Switch
                    //                             trackColor={{ false: 'red', true: 'green' }}
                    //                             thumbColor={false ? '#f5dd4b' : '#f4f3f4'}
                    //                             ios_backgroundColor="#3e3e3e"
                    //                             onValueChange={(val) => { console.log(valueById); changeVal(val, item.id, false); setHideLabel(); }}

                    //                             value={valueById.find(x => { return x.id == item.id })?.value}
                    //                         />
                    //                     </View>

                    //                 </View>
                    //             })}
                    //         </View>
                    //     </View>
                    // } 

                    if (item.companyPropertyValueType == 4) {

                        return <View key={key} style={{ marginBottom: 10 }} >

                            <View style={{ position: "relative", marginBottom: 10 }}>
                                {/* <input type={"checkbox"} readOnly="readonly" onClick={() => { setHideLabel(item.id); document.getElementById(item.id).focus(); }} className={"form-control input-value-label " + (hideLabel == item.id && "hide-value-key")} checked={item.value}></input> */}
                                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>

                                    <Switch
                                        trackColor={{ false: 'red', true: 'green' }}
                                        thumbColor={false ? '#f5dd4b' : '#f4f3f4'}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={(val) => { console.log(valueById); changeVal(val, item.id, true); setHideLabel(); }}

                                        value={valueById.find(x => { return x.id == item.id })?.value == "True" ? true : valueById.find(x => { return x.id == item.id })?.value}
                                    />
                                    <Text style={{ marginLeft: 5 }}>
                                        {item.key}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    }

                    if (item.companyPropertyValueType == 6) {
                        return <View key={key} style={{backgroundColor:"#B2DFDB",
                        marginBottom:10,
                        padding:10,
                        borderColor:"#26A69A",
                        borderWidth:1,
                        borderStyle:"solid"}}>
                            <Text style={{fontWeight:"bold"}}>{item.key} </Text>
                            <View cla style={{ position: "relative" }}>


                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Button title="Galeriden Resim Seç" onPress={() => pickImage(item.id)} />
                                    {valueById.find(x => { return x.id == item.id })?.value && <Image source={{ uri: valueById.find(x => { return x.id == item.id })?.value }} style={{ width: 200, height: 200 }} />}
                                </View>

                            </View>
                        </View>
                    }


                })}
            </ScrollView>
        </>
    )
}
