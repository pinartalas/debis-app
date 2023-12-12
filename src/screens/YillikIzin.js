import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Dialog } from 'react-native-paper';
import { apiConstant } from '../apiCrud/apiConstant';
import { GetAxios, PostAxios } from '../apiCrud/crud';
import DatePicker from '../components/DatePicker';

function YillikIzinScreen(props) {
    const [baseData, setBaseData] = useState([])
    const [openCreate, setOpenCreate] = useState(false)

    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [irtibat, setIrtibat] = useState()
    const [totalDay, setTotalDAy] = useState()
    const [izinAddress, setIzinAddres] = useState()
    const [topForm, setTopForm] = useState(false)


    useEffect(() => {
        start()
    }, [])

    const start = async () => {
        var yill = await GetAxios(apiConstant.BaseUrl + "/api/DebisPersonel/GetCurrentYillikIzin").then(x => { return x.data }).catch(x => { return x });
        setBaseData(yill.data)
       
    }  

    const postYillikIzin = async () => {
        var yill = await PostAxios(apiConstant.BaseUrl + "/api/DebisPersonel/CreateYillikIzinCurrentUser",{
            irtibat:irtibat,
            adres:izinAddress,
            startDate:startDate,
            endDate:endDate,
            totalDay:totalDay
        }).then(x => { return x.data }).catch(x => { return x });
      
        if (yill.isError==false) {
            alert("Yıllık izin Talebi Gönderildi")
            setOpenCreate(false); 
          
        }  
         start(); 
    } 

    return (
        <>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <TouchableOpacity onPress={() => { setOpenCreate(true) }} style={{ backgroundColor: "#1565C0", padding: 10, marginTop: 10, marginBottom: 10 }}>
                    <Text style={{ color: "white" }}>İzin Talep Et</Text>
                </TouchableOpacity>

            </View>
            <ScrollView>
                <View style={{ flexDirection: "row", backgroundColor: "#42A5F5", padding: 7 }}>
                    <View style={{ flex: 1 }}>

                        <Text style={{ fontSize: 11, color: "white", fontWeight: "bold" }}>İzin Başlangıç</Text>
                    </View>
                    <View style={{ flex: 1 }}>

                        <Text style={{ fontSize: 11, color: "white", fontWeight: "bold" }}>İzin Bitiş</Text>
                    </View>
                    <View style={{ flex: 1 }}>

                        <Text style={{ fontSize: 11, color: "white", fontWeight: "bold" }}>Toplam </Text>
                    </View>
                    <View style={{ flex: 1 }}>

                        <Text style={{ fontSize: 11, color: "white", fontWeight: "bold" }}>Onay </Text>
                    </View>

                </View>
                {baseData.map((item, key) => {
                    var mod = key % 2 == 0
                    var style = { flexDirection: "row", backgroundColor: "#BBDEFB", padding: 7 }
                    if (mod) {
                        style.backgroundColor = "white"
                    }
                    return (
                        <View key={key} style={style}>
                            <View style={{ flex: 1 }}>

                                <Text style={{ fontSize: 11 }}>{moment(item.baslangicDate).format("DD/MM/yyyy")}</Text>
                            </View>
                            <View style={{ flex: 1 }}>

                                <Text style={{ fontSize: 11 }}>{moment(item.baslangicDate).format("DD/MM/yyyy")}</Text>
                            </View>
                            <View style={{ flex: 1 }}>

                                <Text style={{ fontSize: 11 }}>{item.toplamGun} Gün</Text>
                            </View>
                            <View style={{ flex: 1 }}>

                                <Text style={{ fontSize: 11 }}>{item.onaylayanad && (item.onaylayanad + " " + item.onaylayanSoyad) || <Text style={{ color: "red" }}>Onaylanmadı</Text>} </Text>
                            </View>

                        </View>
                    )

                })}
            </ScrollView>

            <Dialog visible={openCreate} style={Platform.OS=="ios"&&topForm&& {marginTop:-350}} >
                <Dialog.Content>
                    <View>
                        <Text style={{ fontWeight: "bold", fontSize: 18, color: "green" }}>{"İzin Talep Formu"}</Text>
                        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 15, color: "black", marginTop: 15 }}>Aşağıda bulunan izin talebi formundaki alanları doldurun. </Text>
                        <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: 30, paddingBottom: 5 }}>
                            <Text>İzin Başlangıç Tarihi</Text>
                            <DatePicker  value={startDate} activeDate={new Date()} onChange={(e, d) => { setStartDate(d) }}></DatePicker>

                        </View>
                        <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: 5, paddingBottom: 5 }}>
                            <Text>İzin Bitiş Tarihi</Text>
                            <DatePicker value={endDate} activeDate={new Date()} onChange={(e, d) => { setEndDate(d) }}></DatePicker>
                        </View>
                        <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: 5, paddingBottom: 5 }}>

                            <FloatingLabelInput
                                label="İrtibat Telefon No"
                                value={irtibat}
                                onFocus={()=>setTopForm(true)}
                                onBlur={()=>setTopForm(false)}
                                keyboardType="numeric"
                                onChangeText={(t) => setIrtibat(t)}
                                containerStyles={{
                                    borderWidth: 2,
                                    padding: 10,
                                    backgroundColor: '#fff',
                                    borderColor: '#2196F3',
                                    borderRadius: 8,
                                }}

                                showPasswordContainerStyles={{ backgroundColor: "#2196F3", padding: 2, borderRadius: 5 }}
                            />
                        </View>
                        <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: 5, paddingBottom: 5 }}>

                            <FloatingLabelInput
                                label="Toplam Gün"
                                value={totalDay}
                                keyboardType="numeric"
                                onFocus={()=>setTopForm(true)}
                                onBlur={()=>setTopForm(false)}
                                onChangeText={(t) => setTotalDAy(t)}
                                containerStyles={{
                                    borderWidth: 2,
                                    padding: 10,
                                    backgroundColor: '#fff',
                                    borderColor: '#2196F3',
                                    borderRadius: 8,
                                }}

                                showPasswordContainerStyles={{ backgroundColor: "#2196F3", padding: 2, borderRadius: 5 }}
                            />
                        </View>
                        <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: 5, paddingBottom: 5 }}>

                            <FloatingLabelInput
                                label="İzinde Bulunacağı Adres"
                                value={izinAddress}
                                onFocus={()=>setTopForm(true)}
                                onBlur={()=>setTopForm(false)}
                                onChangeText={(t) => setIzinAddres(t)}
                                containerStyles={{
                                    borderWidth: 2,
                                    padding: 10,
                                    backgroundColor: '#fff',
                                    borderColor: '#2196F3',
                                    borderRadius: 8,
                                }}

                                showPasswordContainerStyles={{ backgroundColor: "#2196F3", padding: 2, borderRadius: 5 }}
                            />
                        </View>

                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 30, paddingBottom: 5 }}>
                            <TouchableOpacity onPress={() =>{ postYillikIzin();}} style={{ backgroundColor: "green", width: 100, justifyContent: "center" }}><Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 16, padding: 8 }}>Tamam</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => setOpenCreate(false)} style={{ backgroundColor: "red", width: 100, justifyContent: "center" }}><Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 16, padding: 8 }}>Vazgeç</Text></TouchableOpacity>

                        </View>
                    </View>

                </Dialog.Content>
            </Dialog>
        </>
    );
}

export default YillikIzinScreen;