import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function Logo({url}) {
    if (url) {
        return <Image source={{uri:url}} style={styles.image} />
    }else{
        return <Image source={require('../../assets/detamLogo.png')} style={styles.image} />
    }
  
}

const styles = StyleSheet.create({
  image: {
    width: 130,
    height: 130,
    marginBottom: 8,
    borderRadius:200,overflow:"hidden" 
  },
})
