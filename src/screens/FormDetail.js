import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { apiConstant } from '../apiCrud/apiConstant';
import { GetAxios, PostAxios } from '../apiCrud/crud';
import CompanyProperty from '../components/CompanyPropert';

function FormDetailScreen(props) {



    const [loadingContent, setLoadingContent] = useState(true);
    const [company, setCompany] = useState({});
    const [activeTab, setActiveTab] = useState("1");
    const [properties, setProperties] = useState([]);
    const [hideLabel, setHideLabel] = useState();
    const [loading, setLoading] = useState(false);
    const [topicStatic, setTopicStatic] = useState(false);
    const [isCompanyBaseGroup, setCompanyBaseGroup] = useState(false);


    useEffect(() => {
        start()
   
    }, [])
    const start = async () => {
        
            
            const id = ""
            var d = await GetAxios(apiConstant.BaseUrl + "/api/Company/GetFullDataCompanyById/" + props.route.params.id).then(x => { return x.data }).catch(x => { return x });
  
            setLoadingContent(false);
            setCompany(d.data.companyData)
            setTopicStatic(d.data.topicStatic)
            setCompanyBaseGroup(d.data.companyData.companyBaseGroup)
            getProperty("1") 
 
    }

    const changeTopic = async (type,value) => {
        if (isCompanyBaseGroup) {
            var d = await PostAxios(apiConstant.BaseUrl + "/api/Company/changeTopic",{ value: value, fieldType: type, topicId: topicStatic.id }).then(x => { return x.data }).catch(x => { return x });

        }
    }
    const getProperty = async (property) => {
       
       
            var d = await GetAxios(apiConstant.BaseUrl + "/api/Company/GetCompanyPropertyByCompanyAndPropertyId/" + props.route.params.id + "/" + property).then(x => { return x.data }).catch(x => { return x });

            setProperties(d.data)
            

        

    }
    const setProperty = async (value, propertyId, isUpload = false) => {
     
        setLoading(true)

        if (isUpload) {
            var d = await PostWithTokenFile("FileUpload/ImageUpload", { name: "file", data: value }).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })

            value = d.data.file.name + d.data.file.extension;

        }


        var d = await PostAxios(apiConstant.BaseUrl + "/api/Company/SetProperty",{ value: value, properyId: propertyId, companyId: company.id }).then(x => { return x.data }).catch(x => { return x });

        // var d = PostWithToken("Company/SetProperty", { value: value, properyId: propertyId, companyId: company.id }).then(x => { getProperty(activeTab) }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })

        let val = ""
        if (value == true) {
            val = "evet"
        } else if (value == false) {
            val = "hayır"
        } else {
            val = value
        }
  
        getProperty(activeTab)
        setLoading(false)

    }
    const setListProperty = async (value, ItemId, propertyId) => {
        setLoading(true)
        var d = PostWithToken("Company/AddCompanyListProperty", { isActive: value, companyId: company.id, itemId: ItemId }).then(x => { return x.data }).catch((e) => { AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor"); return false })
        let val = ""
        if (value == true) {
            val = "evet"
        } else if (value == false) {
            val = "hayır"
        } else {
            val = value
        }
        var litem = properties.find(x => x.id == propertyId).propertySelectLists.find(x => x.id == ItemId)

        await d;
        getProperty(activeTab)
        setLoading(false)

    }
    return ( 
        <>

            <View >


                <View >
                    <CompanyProperty changeTopic={changeTopic} companyType={props.route.params.companyType}  companyName={props.route.params.companyName} companyId={props.route.params.id}  setListProperty={setListProperty} hideLabel={hideLabel} setHideLabel={setHideLabel} setProperty={setProperty} properties={properties}></CompanyProperty>

                </View>


            </View>

        </>
    );
}


export default FormDetailScreen;