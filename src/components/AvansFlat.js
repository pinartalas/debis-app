import { Image, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from "moment";
// import { fileurl } from "../crud/crud";
// import LangApp from "../Language";

function AvansFlat({ item, prp, detailItem, setDetailItem, setDetailShow }) {

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
    function Durum(dr) {
        if (dr == 0) {
            return <Text style={{ fontWeight: "bold", color: "#E65100" }}>Bekliyor</Text>
        }
        if (dr == 1) {
            return <Text style={{ fontWeight: "bold", color: "#E65100" }}>Muhasebe Onayı Bekliyor</Text>
        }
        if (dr == 2) {
            return <Text style={{ fontWeight: "bold", color: "red" }}>Yönetici Reddetti</Text>
        }
        if (dr == 3) {
            return <Text style={{ fontWeight: "bold", color: "green" }}>Muhasebe Onayladı</Text>
        }
        if (dr == 4) {
            return <Text style={{ fontWeight: "bold", color: "red" }}>Muhasebe Reddetti</Text>
        }

    }
    //   var dimgN = item.documnetKind;
    //  console.log(dimgN)
    return (

        <View key={item.id} style={{
            minHeight: 65, margin: 15,
            marginBottom: 10, backgroundColor: "white", borderTopWidth: 1, borderBottomWidth: 1,
            borderColor: "#d8672b", borderWidth: 1, flexDirection: "row"
        }}>

            <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 3, padding: 1 }}>
                <Text style={{ textAlign: "center" }}>{Durum(item.durum)}</Text>
                <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 11, marginTop: 2 }}>Talep Edilen: {item.talepEdilenTutar} Tl </Text>
                <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 11, marginTop: 2 }}>Talep Tarihi : {moment(item.avansTalepTarihi).format("DD/MM/yyyy")}</Text>

            </View>


            {/* <TouchableOpacity onPress={() => { prp.navigation.navigate("FormDetail", { id: item.companyId }) }} style={{ flexDirection: "row", justifyContent: "center", flex: 2, alignItems: "center", backgroundColor: "#d8672b" }}>

                <MaterialCommunityIcons
                    name="pencil"
                    size={20}
                    color="white"
                    style={{ textAlign: 'right' }}
                />
                <Text style={{ color: "white", fontWeight: "bold" }}>Oluştur</Text>
            </TouchableOpacity> */}

        </View>)
}

export default AvansFlat;