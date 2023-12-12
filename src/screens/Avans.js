import React, { startTransition, useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { Dialog } from 'react-native-paper';
import { apiConstant } from '../apiCrud/apiConstant';
import { GetAxios, PostAxios } from '../apiCrud/crud';
import AvansFlat from '../components/AvansFlat';
import Loading from '../components/loading';

function AvansScreen(props) {
    const [listData, setListData] = useState([])
    const [dataLoading, setDataLoading] = useState(false)
    const [avansData, setAvansData] = useState();
    const [openCreate, setOpenCreate] = useState(false)
    const [topForm, setTopForm] = useState(false)

    useEffect(() => {
        start()
    }, []) 

    const start = async () => {
        setDataLoading(true)
        var url = apiConstant.BaseUrl + "/api/DebisPersonel/GetCurrentUserMaasAvans"
        var rps = await GetAxios(url).then(x => { return x.data }).catch(x => { return undefined });
        setListData(rps.data)
        setDataLoading(false)

    }

    const avansGonder = async () => {
        var yill = await PostAxios(apiConstant.BaseUrl + "/api/DebisPersonel/MaasAvansCreate",avansData).then(x => { return x.data }).catch(x => { return x });
      console.log(avansData)
        if (yill.isError==false) {
            alert("Avans Talebi Gönderildi")
            setOpenCreate(false); 
          
        }  
         start(); 

    }

    return (
        <>

            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <TouchableOpacity onPress={()=>setOpenCreate(true)} style={{ backgroundColor: "#1565C0", padding: 10, marginTop: 10, marginBottom: 10 }}>
                    <Text style={{ color: "white" }}>Yeni Talep Oluştur</Text>
                </TouchableOpacity>

            </View>
            <View style={{ marginTop: 20 }}>

                <FlatList
                    data={listData}
                    renderItem={({ item }) => <AvansFlat setDetailShow={false} setDetailItem={false} key={item.id} item={item} prp={props} />}
                    horizontal={false}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={dataLoading && <View style={{ justifyContent: "center", flexDirection: "row" }}><Loading></Loading></View>}

                    numColumns={1}
              
                />
            </View>
            <Dialog visible={openCreate} style={Platform.OS=="ios"&&topForm&& {marginTop:-350}} >
                <Dialog.Content>
                    <View>
                        <Text style={{ fontWeight: "bold", fontSize: 18, color: "green" }}>{"Avans Talep Formu"}</Text>
                
                        <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: 5, paddingBottom: 5 }}>

                            <FloatingLabelInput
                                label="TalepEdilenTutar"
                                value={avansData?.talepEdilenTutar}
                            
                                onFocus={()=>setTopForm(true)}
                                onBlur={()=>setTopForm(false)}
                                keyboardType="numeric"
                                onChangeText={(t) => setAvansData({...avansData,talepEdilenTutar:t})}
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
                                label="Açıklama"
                                value={avansData?.aciklama}
                                onFocus={()=>setTopForm(true)}
                                onBlur={()=>setTopForm(false)}
                                onChangeText={(t) => setAvansData({...avansData,aciklama:t})}
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
                            <TouchableOpacity onPress={() =>{ avansGonder();}} style={{ backgroundColor: "green", width: 100, justifyContent: "center" }}><Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 16, padding: 8 }}>Gönder</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => setOpenCreate(false)} style={{ backgroundColor: "red", width: 100, justifyContent: "center" }}><Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 16, padding: 8 }}>Vazgeç</Text></TouchableOpacity>

                        </View>
                    </View>

                </Dialog.Content>
            </Dialog>
        </>
    );
}

export default AvansScreen;