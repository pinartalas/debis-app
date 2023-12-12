import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { connect } from 'react-redux';

import moment from 'moment';
import 'moment/locale/tr';
import 'dayjs/locale/tr'
import { apiConstant } from '../apiCrud/apiConstant';
import { GetAxios, PostAxios } from '../apiCrud/crud';

import { Calendar } from 'react-native-big-calendar'
import { TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import Loading from '../components/loading';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dialog } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import SearchableDropDown from 'react-native-searchable-dropdown';
import DatePicker from '../components/DatePicker';
function CalendarScreen(props) {


    const [sampleEvents, setSampleEvents] = useState()
    const [selectedDay, setSelectedDay] = useState()
    const [activeDate, setActiveDate] = useState(new Date())
    const [selectedEvent, setSelectedEvent] = useState()
    const [eventCreateDialog, setEventCreateDialog] = useState(false)
    const [selectedCalismaTipi, setSelectedCalismaTipi] = useState()
    const [selectedCalismaAltTipi, setSelectedCalismaAltTipi] = useState()

    const [gropBase, setGroupBase] = useState([])
    const [subGropBase, setSubGroupBase] = useState([])
    const [firmDialog, setFirmDialog] = useState(false)
    const [isCompanyView, setISCompanyView] = useState(false)
    const [companySelectList, setComapmySelectList] = useState([])
    const [selectedCompany, setSelectedCompany] = useState()
    const [selectedProject, setSelectedProject] = useState()
    const [selectedAgent, setSelectedAgent] = useState([])
    const [isınAciklamasi, setIsinAciklamasi] = useState()
    const [topMargin, setTopmargin] = useState(false)

    const [requestData, setRequestData] = useState({
        companyName: "",
        endDate: null,
        startDate: new Date(),
        explanationText: "",
        groupId: 0,
        title: "",
        customerId: 0,
        projectId: 0,
        customerAgentId: 1
    })



    useEffect(() => { start() }, [])
    const start = async () => {

        fillCalendar(moment(new Date(), "yyyy-MM-DD").add(-1, 'month'), moment(new Date(), "yyyy-MM-DD").add(1, 'month'))
        workGroupFill(0)

    }

    const getCompanyByName = async (name) => {
        var url = apiConstant.BaseUrl + "/api/DebisCompany/GetActiveCustomersByName"
        var rps = await PostAxios(url, { key: name }).then(x => { return x.data }).catch(x => { return undefined });


        setComapmySelectList(rps.data)

    }

    const workGroupFill = async (id) => {

        var url = apiConstant.BaseUrl + "/api/DebisWorkPlan/GetWorkplanGroup"
        var rps = await GetAxios(url + "/" + id).then(x => { return x.data }).catch(x => { return undefined });

        if (id == 0) {
            setGroupBase(rps.data)
        } else {
            setSubGroupBase(rps.data)
        }

    }
    const workGroupCreate = async () => {

        var url = apiConstant.BaseUrl + "/api/DebisWorkPlan/CreateWorkPlan"
        var rps = await PostAxios(url, requestData).then(x => { return x.data }).catch(x => { return x });

        setRequestData({
            companyName: "",
            endDate: new Date(),
            startDate: new Date(),
            explanationText: "",
            groupId: 0,
            title: "",
            customerId: 0,
            projectId: 0,
            customerAgentId: 1
        })


        if (rps) {
            alert("Kayıt Başarılı")
        } else {
            alert("Kayıt yapılamadı")
        }
        fillCalendar(moment(new Date(), "yyyy-MM-DD").add(-1, 'month'), moment(new Date(), "yyyy-MM-DD").add(1, 'month'))

    }


    const fillCalendar = async (startDate, endDate) => {
        var url = apiConstant.BaseUrl + "/api/DebisPersonel/GetPersonelCalendar"

        var rps = await PostAxios(url, { startDate: startDate, endDate: endDate }).then(x => { return x.data }).catch(x => { return undefined });

        // console.log(rps.data)
        var eventList = []
        for (const item of rps.data) {
            eventList.push({ start: new Date(item.start), end: new Date(item.end), title: item.explanationText, backColor: item.color, company: item.companyName })
        }
        setSampleEvents()
        setTimeout(() => {
            setSampleEvents(eventList)
        }, 1);

    }


    return (
        <View style={{ flex: 1 }}>

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomColor: "#303F9F", borderBottomWidth: 7 }}>
                <TouchableOpacity onPress={() => {
                    fillCalendar(moment(moment(activeDate).add(-1, "month")).add(-1, 'month'), moment(moment(activeDate).add(-1, "month")).add(1, 'month'))
                    setActiveDate(moment(activeDate).add(-1, "month"))
                }} style={{ marginBottom: 17, marginTop: 17, backgroundColor: "grey", height: 40, width: 95, alignItems: "center", justifyContent: "center", borderRadius: 5 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 12, color: "white" }}>{"◄ "}Öceki Ay</Text>
                </TouchableOpacity>
                <View>
                    <DatePicker value={activeDate} activeDate={activeDate} onChange={(e, d) => { setActiveDate(d) }}>

                    </DatePicker>
                    {/* {
                        Platform.OS == "ios" && <DateTimePicker
                            testID="dateTimePicker"
                            value={new Date(activeDate)}
                            mode={"date"}

                            locale="tr"
                            is24Hour={true}
                            onChange={(e, d) => { setActiveDate(d) }}
                        />
                    }
                    {

                        Platform.OS != "ios" && <>
                            <TouchableOpacity style={{padding:10,borderRadius:10,backgroundColor:"#BDBDBD"}} onPress={() => setDatetimePicker(1)}>
                                <Text>{moment(activeDate).format("DD/MM/yyy")}</Text>
                            </TouchableOpacity>
                            {datetimePicker == 1 && <DateTimePicker
                                testID="dateTimePicker"
                                value={new Date(activeDate)}
                                mode={"date"}

                                locale="tr"
                                is24Hour={true}
                                onChange={(e, d) => { setActiveDate(d);setDatetimePicker(undefined); }}
                            />}
                        </>
                    } */}


                </View>
                <TouchableOpacity onPress={() => {
                    fillCalendar(moment(new Date(activeDate), "yyyy-MM-DD").add(-1, 'month'), moment(new Date(activeDate), "yyyy-MM-DD").add(2, 'month'))

                    setActiveDate(moment(activeDate).add(1, "month"))
                }} style={{ marginBottom: 17, marginTop: 17, backgroundColor: "grey", height: 40, width: 95, alignItems: "center", justifyContent: "center", borderRadius: 5 }}>
                    <Text style={{ fontWeight: "bold", fontSize: 12, color: "white" }}>Sonraki Ay{" ►"}</Text>
                </TouchableOpacity>
            </View>
            <View>
                <View style={{ paddingBottom: 10, backgroundColor: "#303F9F", width: "100%", height: 40, alignItems: "center", justifyContent: "center" }}>
                    <TouchableOpacity onPress={() => {
                        setEventCreateDialog(true); setSelectedCalismaTipi(null)
                        setSelectedCalismaAltTipi(null);
                        setISCompanyView(false)
                    }} style={{
                        backgroundColor: "#1976D2",
                        borderColor: "#E0F7FA", borderWidth: 1, borderStyle: 'solid', borderRadius: 5, padding: 7,

                    }}>
                        <Text style={{ fontWeight: "bold", fontSize: 12, color: "white", }}><Icon name="edit" size={15} color="white" />Yeni Takvim Kaydı Oluştur</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {!sampleEvents &&
                <View style={{ marginTop: 50, width: "100%", alignItems: "center", height: 300 }}><Loading height={70} width={70}></Loading></View>

            }
            {sampleEvents &&

                <Calendar
                    date={activeDate}
                    swipeEnabled={false}
                    renderHeaderForMonthView={(dd) => {
                        var ss = ["Ptesi", "Sal", "Çar", "Per", "Cum", "Ctesi", "Pzr"].map((item, key) => {
                            return (<Text key={key} style={{
                                alignItems: "center",
                                flex: 1,
                                fontWeight: "bold",
                                textAlign: "center",
                                fontSize: 12,
                                borderColor: "white",
                                borderWidth: 1,
                                borderStyle: "solid",
                                height: "100%",
                                paddingTop: 15
                            }}>{item}</Text>)
                        })
                        return <View style={{
                            alignItems: "center", flexDirection: "row",
                            height: 50, backgroundColor: "#CFD8DC"
                        }}>{ss}</View>

                    }}
                    onPressMoreLabel={() => { alert("Demo gösteriminde kapattım") }}

                    renderEvent={(d) => <View style={{ backgroundColor: d.backColor, height: 18, justifyContent: "center", borderRadius: 5 }}><Text style={{ fontSize: 10, color: "white" }}> {d.title?.substring(0, 5)}...</Text></View>}
                    mode='month'
                    onPressEvent={(d) => { setSelectedEvent(d); }}
                    locale='tr'
                    events={sampleEvents} height={600} />
            }

            <Dialog visible={selectedEvent ? true : false} style={{ borderRadius: 10, padding: 5 }}>
                <View>
                    <Text style={{ fontWeight: "bold", fontSize: 18, color: "#1B5E20" }}>{"Takvim Kayıt Detayı"}</Text>
                    <Text style={{ fontSize: 13, color: "black", marginTop: 15 }}>{selectedEvent?.title}</Text>
                    <Text style={{ fontSize: 13, color: "black", marginTop: 15 }}><Text style={{ fontWeight: "bold" }}>Başlangıç : </Text>  {moment(selectedEvent?.start).format("DD-MM-yyyy HH:mm")}</Text>
                    <Text style={{ fontSize: 13, color: "black", marginTop: 4 }}><Text style={{ fontWeight: "bold" }}>Bitiş : </Text>  {moment(selectedEvent?.start).format("DD-MM-yyyy HH:mm")}</Text>

                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 30, paddingBottom: 5 }}>
                        <TouchableOpacity onPress={() => setSelectedEvent(undefined)} style={{ backgroundColor: "green", width: 100, justifyContent: "center" }}><Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 16, padding: 8 }}>Tamam</Text></TouchableOpacity>
                        {/* <TouchableOpacity onPress={() => setPasswordDialog(false)} style={{ backgroundColor: "red", width: 100, justifyContent: "center" }}><Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 16, padding: 8 }}>Vazgeç</Text></TouchableOpacity> */}

                    </View>
                </View>
            </Dialog>

            <Dialog visible={eventCreateDialog} style={{ borderRadius: 10, padding: 5, justifyContent: "center", alignItems: "center" }}>
                <View style={{ width: "100%" }}>
                    <Text style={{ fontWeight: "bold", fontSize: 18, color: "#1B5E20" }}>{"Takvim Kaydı Oluştur"}</Text>
                    <View style={{ flexDirection: "column", justifyContent: "center", marginTop: 20 }}>

                        <View style={{ flexDirection: "row", marginTop: 7, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontWeight: "bold" }}>Tarih </Text>
                            <DatePicker value={new Date(requestData.startDate)} activeDate={activeDate} onChange={(e, d) => { setRequestData({ ...requestData, startDate: moment(d), endDate: moment(d) }); }}></DatePicker>




                        </View>
                        {/* <View style={{ flexDirection: "row", marginTop: 1, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontWeight: "bold" }}>Başlangıç</Text>
                            <DateTimePicker
                                testID="dateTimePicker_"
                                value={new Date(activeDate)}
                                mode={"datetime"}

                                locale="tr"
                                is24Hour={true}
                                onChange={(e, d) => { setActiveDate(d); setRequestData({ ...requestData, endDate: moment(d).add(1,"day")  }) }}
                            />
                        </View> */}
                        <View style={{ flexDirection: "row", marginTop: 1, height: 70, overflow: "hidden", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontWeight: "bold" }}>işin Açıklaması</Text>
                            <View style={{ flex: 1 }}>
                                <TextInput onChangeText={(d) => { setIsinAciklamasi(d); setRequestData({ ...requestData, explanationText: d }) }} style={{ padding: 5, height: 60, borderColor: "black", borderWidth: 1, borderStyle: 'solid', width: "100%" }} ></TextInput>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", marginTop: 1, height: 110, overflow: "hidden", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontWeight: "bold" }}>Çalışma Tipi</Text>
                            <View style={{ flex: 1 }}>
                                <Picker

                                    itemStyle={{ fontSize: 13 }}
                                    selectedValue={selectedCalismaTipi}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setSelectedCalismaTipi(itemValue);
                                        if (itemValue != null) {

                                            workGroupFill(itemValue)
                                            setRequestData({ ...requestData, groupId: itemValue })
                                            setRequestData({ ...requestData, title: gropBase.find(x => { return x.id == itemValue }).name })

                                        }

                                    }}>
                                    <Picker.Item label={"Seçiniz"} value={null} />
                                    {gropBase.map((item, key) => {
                                        return <Picker.Item key={key} label={item.name} value={item.id} />
                                    })}

                                </Picker>
                            </View>
                        </View>



                        {subGropBase.length > 0 && <View style={{ flexDirection: "row", marginTop: 1, height: 80, overflow: "hidden", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ fontWeight: "bold" }}>Yapılan Çalışma</Text>
                            <View style={{ flex: 1 }}>
                                <Picker
                                    itemStyle={{ fontSize: 13 }}
                                    selectedValue={selectedCalismaAltTipi}
                                    onValueChange={(itemValue, itemIndex) => {

                                        setSelectedCalismaAltTipi(itemValue);
                                        if (itemValue != null) {
                                            setISCompanyView(subGropBase.find(x => { return x.id == itemValue }))
                                            setRequestData({ ...requestData, groupId: itemValue })
                                        }

                                    }}>
                                    <Picker.Item label={"Seçiniz"} value={null} />
                                    {subGropBase.map((item, key) => {
                                        return <Picker.Item key={key} label={item.name} value={item.id} />
                                    })}

                                </Picker>
                            </View>
                        </View>}
                        {isCompanyView.customerSelect && <View style={{ flexDirection: "row", marginTop: 1, height: 80, overflow: "hidden", justifyContent: "center", alignItems: "center" }}>

                            <TouchableOpacity onPress={() => setFirmDialog(true)} style={{ backgroundColor: "#6A1B9A", padding: 15 }}>
                                <Text style={{ fontWeight: "bold", color: "white" }}>DETAYLARI SEÇ</Text>
                            </TouchableOpacity>


                        </View>}

                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 30, paddingBottom: 5 }}>
                        <TouchableOpacity onPress={() => { workGroupCreate(); setSelectedEvent(undefined); setEventCreateDialog(false) }} style={{ backgroundColor: "green", width: 100, justifyContent: "center" }}><Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 16, padding: 8 }}>Kaydet</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => setEventCreateDialog(false)} style={{ backgroundColor: "red", width: 100, justifyContent: "center" }}><Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 16, padding: 8 }}>Vazgeç</Text></TouchableOpacity>

                    </View>
                </View>
            </Dialog>

            <Dialog visible={firmDialog} style={{ borderRadius: 10, padding: 5, height: "100%", flexDirection: "column" }}>
                <View style={topMargin == true && { marginTop: -100 } || { marginTop: 0 }} >
                    <Text style={{ fontWeight: "bold", fontSize: 18, color: "#1B5E20" }}>{"Firma Şantiye"}</Text>


                    <View style={{ marginTop: 15 }}>
                        <Text>Firma Seç</Text>
                        <SearchableDropDown
                            onItemSelect={(item) => {
                                setSelectedCompany(item);
                                // console.log(item)
                                setRequestData({ ...requestData, customerId: item.id })
                            }}
                            containerStyle={{ padding: 5 }}
                            selectedItems={selectedCompany}
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
                            items={companySelectList}

                            resetValue={false}
                            textInputProps={
                                {
                                    placeholder: "Firma Arayınız",
                                    underlineColorAndroid: "Firma Arayınız",
                                    style: {
                                        padding: 12,
                                        borderWidth: 1,
                                        borderColor: '#ccc',
                                        borderRadius: 5,
                                    },
                                    onblur: () => { alert("fds") },
                                    onTextChange: text => {
                                        if (text.length >= 2) {
                                            setComapmySelectList([]);
                                            setTimeout(async () => {
                                                await getCompanyByName(text)
                                            }, 60);
                                        }
                                    }
                                }
                            }
                            listProps={
                                {
                                    nestedScrollEnabled: false,
                                }
                            }
                        /></View>

                    {selectedCompany && <View style={{ marginTop: 10 }}>
                        <Text>Proje Seç</Text>
                        <SearchableDropDown
                            onItemSelect={(item) => {

                                setSelectedProject(item);
                                ; setRequestData({ ...requestData, projectId: item.id })
                            }}

                            containerStyle={{ padding: 5 }}
                            selectedItems={selectedProject}
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
                            items={selectedCompany?.customerProjects}

                            resetValue={false}
                            textInputProps={
                                {
                                    placeholder: "Proje Arayınız",
                                    underlineColorAndroid: "Proje Arayınız",
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
                        /></View>}
                    {selectedCompany && <View style={{ marginTop: 10, marginBottom: 70 }}>
                        <Text>Firma Yetkilisi</Text>
                        <SearchableDropDown
                            onItemSelect={(item) => {

                                setSelectedAgent(item);
                                ; setRequestData({ ...requestData, customerAgentId: item.id })
                            }}
                            // onRemoveItem={(item, index) => {
                            //     const items = selectedAgent.filter((sitem) => sitem.id !== item.id);
                            //     setSelectedAgent(items);
                            //     alert(JSON.parse(items))
                            //   }}

                            containerStyle={{ padding: 5 }}
                            selectedItems={selectedAgent}
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
                            items={selectedCompany?.customerAgent}

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
                        /></View>}


                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginBottom: 100, paddingBottom: 5 }}>
                    <TouchableOpacity onPress={() => setFirmDialog(false)} style={{ backgroundColor: "green", width: 100, justifyContent: "center" }}><Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 16, padding: 8 }}>Tamam</Text></TouchableOpacity>
                    {/* <TouchableOpacity onPress={() => setFirmDialog(false)} style={{ backgroundColor: "red", width: 100, justifyContent: "center" }}><Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 16, padding: 8 }}>Vazgeç</Text></TouchableOpacity> */}

                </View>
            </Dialog>
        </View>
    );
}
const mapStateToProps = (state) => {

    return {
        user: state
    }
}
const mapDispatchToProps = (dispatch) => {

    return {

        changeUser: (data) => dispatch({ type: "UserData", payload: data })
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreen);