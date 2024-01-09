import { Image, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { PostAxios } from "../apiCrud/crud";
import { apiConstant } from "../apiCrud/apiConstant";
// import { fileurl } from "../crud/crud";
// import LangApp from "../Language";

function FromFlat({ item, prp, detailItem, setDetailItem, setDetailShow, deleteData }) {


    const [showMulti, setShowMulti] = useState(false)

    const [gruopItem, setGroupItem] = useState([])

    const getByTopicId = async (topicId) => {

        d = await PostAxios(apiConstant.BaseUrl + "/api/Company/getbytopicIdforMobil", {
            pageNumber: 1,
            pageSize: 10,
            topicId: topicId

        }).then(x => { return x.data }).catch(x => { return x });
   
        setGroupItem(d.data)
    }
    if (!item) { return <></> }
    var fppName = "";
    if (item?.companyName != null) {
        fppName = item?.companyName
    }
    if (item?.personName != " ") {
        fppName = item?.personName
    }
    if (item?.productName != null) {
        fppName = item?.productName
    }
    //   var dimgN = item.documnetKind;
    //  console.log(dimgN)
    return (

        <View key={item.id} style={{
            margin: 15,
            padding: 15,
            marginBottom: 10, backgroundColor: "#ECEFF1", borderTopWidth: 1, borderBottomWidth: 1,
            borderColor: "#78909C", borderWidth: 1, flexDirection: "row",
            
        }}>
            {!item.isMulti && <>

                <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 4, padding: 1 }}>
                    <Text style={{ textAlign: "center" }}>{item.companyName}</Text>
                    <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 11, marginTop: 2 }}>({item.companyType})</Text>

                </View>


                <TouchableOpacity onPress={() => { prp.navigation.navigate("FormDetail", { id: item.companyId, companyType: item.companyType, companyName: item.companyName }) }} style={{ flexDirection: "row", justifyContent: "center", flex: 1, alignItems: "center", backgroundColor: "#2E7D32" }}>

                    <MaterialCommunityIcons
                        name="pencil"
                        size={20}
                        color="white"
                        style={{ textAlign: 'right' }}
                    />
                    <Text style={{ color: "white", fontWeight: "bold" }}></Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { deleteData(item.companyId) }} style={{ marginLeft: 5, flexDirection: "row", justifyContent: "center", flex: 1, alignItems: "center", backgroundColor: "red" }}>

                    <MaterialCommunityIcons
                        name="delete"
                        size={20}
                        color="white"
                        style={{ textAlign: 'right' }}
                    />
                    <Text style={{ color: "white", fontWeight: "bold" }}></Text>
                </TouchableOpacity>
            </>}

          {  item.isMulti && <>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ flex: 17,fontWeight:"bold" }}>{item.companyName}</Text>
                        <TouchableOpacity style={{ marginLeft: 6, flex: 1, backgroundColor: "#1565C0", padding: 10 }} onPress={() => { getByTopicId(item.companyBaseGroupTopicId); setShowMulti(!showMulti) }}>
                            <Text>

                                {!showMulti && <Icon size={20} color={"white"} name='chevron-circle-down'></Icon>}
                                {showMulti && <Icon size={20} color={"white"} name='chevron-circle-up'></Icon>}

                            </Text>

                        </TouchableOpacity>

                    </View>

                    {showMulti && <View>
                        {gruopItem.map((jitem, jkey) => {
                            return <View key={jkey} style={{flexDirection:"row" ,marginTop:15,backgroundColor:"white",padding:5}}>



                                <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 5, padding: 1 }}>
                                    <Text style={{ textAlign: "center" }}>{jitem.companyName}</Text>
                                    <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 11, marginTop: 2 }}>({jitem.companyType})</Text>

                                </View>


                                <TouchableOpacity onPress={() => { prp.navigation.navigate("FormDetail", { id: jitem.companyId, companyType: jitem.companyType, companyName: jitem.companyName }) }} style={{ flexDirection: "row", justifyContent: "center", flex: 1, alignItems: "center", backgroundColor: "#2E7D32" }}>

                                    <MaterialCommunityIcons
                                        name="pencil"
                                        size={20}
                                        color="white"
                                        style={{ textAlign: 'right' }}
                                    />
                                    <Text style={{ color: "white", fontWeight: "bold" }}></Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => { deleteData(jitem.companyId) }} style={{ marginLeft: 5, flexDirection: "row", justifyContent: "center", flex: 1, alignItems: "center", backgroundColor: "red" }}>

                                    <MaterialCommunityIcons
                                        name="delete"
                                        size={20}
                                        color="white"
                                        style={{ textAlign: 'right' }}
                                    />
                                    <Text style={{ color: "white", fontWeight: "bold" }}></Text>
                                </TouchableOpacity>

                            </View>

                        })

                        }

                    </View>}
                </View>
            </>}
        </View>)
}

export default FromFlat;