import * as React from 'react';
import { Button, SafeAreaView, Text, TouchableOpacity, View, Image, Animated, StyleSheet, Easing, ImageBackground, ScrollView } from 'react-native';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';


import Icon from 'react-native-vector-icons/FontAwesome';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import CalendarScreen from './Calendar';
import Logo from '../components/Logo';
import InvoicesScreen from './Invoices';
import YillikIzinScreen from './YillikIzin';
import FromsScreen from './Forms';
import FormDetailScreen from './FormDetail';
import AvansScreen from './Avans';


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
export default function AppNavigation({ initialData,startApp }) {
    const INPUT_RANGE_START = 0;
    const INPUT_RANGE_END = 1;
    const OUTPUT_RANGE_START = -281;
    const OUTPUT_RANGE_END = 0;
    const ANIMATION_TO_VALUE = 1;
    const ANIMATION_DURATION = 25000;
    const initialValue = 0;
    const [logOut, setLogOut] = React.useState();

    const translateValue = React.useRef(new Animated.Value(initialValue)).current;
    useEffect(() => {


        const translate = () => {
            translateValue.setValue(initialValue);
            Animated.timing(translateValue, {
                toValue: ANIMATION_TO_VALUE,
                duration: ANIMATION_DURATION,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => translate());
        };

        translate();
    }, [translateValue]);


    const translateAnimation = translateValue.interpolate({
        inputRange: [INPUT_RANGE_START, INPUT_RANGE_END],
        outputRange: [OUTPUT_RANGE_START, OUTPUT_RANGE_END],
    });

    const initialState = initialData;

    const userReduccer = (state = initialState, action) => {
        switch (action.type) {
            case "SetUserData":
                return {
                    data: action.payload.data,
                };
            default:
                return state;
        }
    };
    const AppStack = createStackNavigator();



    const store = createStore(userReduccer);
    const MyDrawer = () => {
        return (<Drawer.Navigator screenOptions={{ headerShown: true }} drawerContent={(props) => (

            <View style={{ flex: 1 }}>

                <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }} style={{ flex: 1 }}>
                    <View style={{ flexDirection: "column", flex: 1 }}>
                        <View> 
                            <View style={{ marginBottom: 5, marginTop: 25, flexDirection: "row", justifyContent: "center" }}>
                                <Logo url={"https://www.detambilgislem.biz.tr/demo/Personel/" + initialData.resimUrl} />
                            </View>
                            <View style={{ marginBottom: 20, flexDirection: "column", alignItems: "center", justifyContent: "center", borderColor: "#cfd8dc", borderBottomWidth: 1, borderStyle: "solid", paddingBottom: 10 }}>

                                <Text style={{ color: "#1565C0", fontSize: 18, fontWeight: "bold" }}>{initialData.ad + " " + initialData.soyad}</Text>
                                <Text style={{ color: "#1565C0", fontSize: 14 }}>{"(" + initialData.jobTitleName + ")"}</Text>
                                <Text style={{ color: "#1565C0", fontSize: 14 }}><Text style={{fontWeight:"bold"}}>Şube :</Text> { initialData.branch}</Text>
                                <Text style={{ color: "#1565C0", fontSize: 14 }}><Text style={{fontWeight:"bold"}}>Departman :</Text> { initialData.department}</Text>


                            </View>
                        </View>
                        <ScrollView style={{ flex: 1, flexDirection: "column" }}>
                            <DrawerItemList   {...props} />
                        </ScrollView>
                        <View>
                            <View style={{ marginBottom: 25, flexDirection: "column" }}>
                                <TouchableOpacity style={{ alignSelf: "center", marginBottom: 5, flexDirection: "column", borderRadius: 5, width: "98%", height: 35, justifyContent: "center" }} onPress={async () => { await AsyncStorage.removeItem("llsddtmllgn").then(x => { return x }); startApp() }} >
                                    <Text style={{ textAlign: "center", fontWeight: 'bold', color: "#ff7043" }}><Icon name="sign-out" size={16} color="#ff7043" /> Log Out</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        )} initialRouteName="calendar">
            <Drawer.Screen name="calendar" options={{ drawerIcon: () => <Icon name="calendar" size={30} color="#4a0072" />, drawerLabel: "Takvim", title: "Takvim" }} component={CalendarScreen} />
            <Drawer.Screen name="rapor" options={{ drawerIcon: () => <Icon name="file" size={30} color="#AD1457" />, drawerLabel: "Rapor", title: "Rapor" }} component={FromsScreen} />
            <Drawer.Screen name="izinler" options={{ drawerIcon: () => <Icon name="map" size={30} color="#FF6F00" />, drawerLabel: "İzinler", title: "İzinler" }} component={YillikIzinScreen} />
            <Drawer.Screen name="fatura" options={{ drawerIcon: () => <Icon name="check" size={30} color="#33691E" />, drawerLabel: "Fatura", title: "Fatura" }} component={InvoicesScreen} />
            <Drawer.Screen name="avans" options={{ drawerIcon: () => <Icon name="money" size={30} color="#1A237E" />, drawerLabel: "Avans", title: "Avans" }} component={AvansScreen} />

        </Drawer.Navigator>)
    }
    return (
        <Provider store={store}>
            <NavigationContainer>
                <AppStack.Navigator initialRouteName="Geri">
                    <AppStack.Screen name="Geri" options={{ headerShown: false }} component={MyDrawer} />
                    <AppStack.Screen name="FormDetail" component={FormDetailScreen} />
                </AppStack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}
const styles = StyleSheet.create({

    background: {
        position: 'absolute',
        zIndex: 1,
        width: 1200,
        height: 1200,
        top: 0,
        opacity: 0.2,
        transform: [
            {
                translateX: 0,
            },
            {
                translateY: 0,
            },
        ],
    },
});