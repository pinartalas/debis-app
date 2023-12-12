// App.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { apiConstant } from './src/apiCrud/apiConstant';
import { GetAxios, PostAxios, PostAxiosAnonym } from './src/apiCrud/crud';
import { Dialog, Portal, PaperProvider } from 'react-native-paper';
import AppNavigation from './src/screens/appNavigation';
import * as Updates from 'expo-updates';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loading from './src/components/loading';
const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState();
  const [initialData, setInitialData] = useState({});
  const [alertDialog2, setAlertDialog2] = useState(false)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    try {
      start()

    } catch (error) {
      throw error
    }


  }, [])


  const start = async () => {

    //  var sads=await AsyncStorage.removeItem("hlcapptokengDua").then(x => { return x }); //////Silinecek

    var tkn = await AsyncStorage.getItem("llsddtmllgn").then(x => { return x })



    if (tkn == null) {
      setIsLoggedIn(null)
    } else {
      var url = apiConstant.BaseUrl + "/api/DebisPersonel/GetCurrentUser"

      var rps = await GetAxios(url).then(x => { return x.data }).catch(x => { return undefined });

      if (rps.data) {
        setInitialData(rps.data)
      }

      setIsLoggedIn(true)

    }





  }


  const handleLogin = async () => {
    setLoading(true)
    var url = apiConstant.BaseUrl + "/api/DebisLogin/LoginOrCreate"

    var rps = await PostAxios(url, { userName: username, password: password }).then(x => { return x.data }).catch(x => { return undefined });
    setLoading(false)
    if (rps.data?.token) {
      await AsyncStorage.setItem("llsddtmllgn", rps.data?.token)
     start();
    } else {
      setAlertDialog2(true)
    }

  };

  return (<PaperProvider >
    <Portal>


      {!isLoggedIn ? (
        <View style={styles.container}>







          <View style={{
            width: "95%", alignItems: "center", flexDirection: "column",
            backgroundColor: "#E0F7FA",
            paddingBottom: 15,
            paddingTop: 15,
            borderRadius: 10,
            borderColor: "blue",
            borderWidth: 1,
            borderStyle: "dashed"
          }}>

            <Image source={require('./assets/detamLogo.png')} style={styles.logo} />
            <Text style={{ fontSize: 17, fontWeight: "bold", color: "#2196F3", marginBottom: 15 }}>Debis Giriş Formu</Text>
            <View style={{ flexDirection: "row", padding: 20, paddingTop: 1, paddingBottom: 0 }}>
              <FloatingLabelInput
                label="E-Posta"
                value={username}
                inputMode="email"
                onChangeText={(text) => setUsername(text)}
                darkTheme={true}
                containerStyles={{
                  borderWidth: 2,
                  padding: 10,
                  backgroundColor: '#fff',
                  borderColor: '#2196F3',
                  borderRadius: 8,
                }}
              />
            </View>

            <View style={{ flexDirection: "row", padding: 20, paddingTop: 10 }}>

              <FloatingLabelInput
                label="Şifre"
                value={password}
                isPassword={true}
                onChangeText={(t) => setPassword(t)}
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


            <TouchableOpacity onPress={handleLogin} style={{
              backgroundColor: "#B3E5FC", padding: 12,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}>
              {loading&&<View style={{paddingTop:7,marginRight:5}}><Loading width={25} height={25}></Loading></View>}
              <Text style={{ fontWeight: "bold", fontSize: 17 }}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>


        </View>) : <AppNavigation initialData={initialData} startApp={start}></AppNavigation>}

      <Dialog visible={alertDialog2} onDismiss={() => setAlertDialog2(false)} >
        <Dialog.Content>
          <View>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "red" }}>{"Hata"}</Text>
            <Text style={{ fontWeight: "bold", fontSize: 15, color: "black", marginTop: 15 }}>Debis kullanıcı adı veya parola hatalı. </Text>

            <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 30, paddingBottom: 5 }}>
              <TouchableOpacity onPress={() => setAlertDialog2(false)} style={{ backgroundColor: "green", width: 100, justifyContent: "center" }}><Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 16, padding: 8 }}>Tamam</Text></TouchableOpacity>
              {/* <TouchableOpacity onPress={() => setPasswordDialog(false)} style={{ backgroundColor: "red", width: 100, justifyContent: "center" }}><Text style={{ textAlign: "center", color: "white", fontWeight: "bold", fontSize: 16, padding: 8 }}>Vazgeç</Text></TouchableOpacity> */}

            </View>
          </View>

        </Dialog.Content>
      </Dialog>

    </Portal>
  </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    flexDirection: "row"
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,

  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    width: '80%',
    backgroundColor: "white"
  },
});

export default App;