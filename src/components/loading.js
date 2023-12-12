import { Image } from 'react-native';

function Loading({width,height}) {
    return (    <Image source={require('../../assets/loading.gif')} style={{  width: width||30,
        height: height||30  ,
        marginBottom: 8,}} /> );
}

export default Loading;