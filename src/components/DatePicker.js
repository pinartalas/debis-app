import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { connect } from 'react-redux';

import moment from 'moment';
import 'moment/locale/tr';
import 'dayjs/locale/tr'

import { TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';


function DatePicker({value,onChange,activeDate}) {
    const [datetimePicker, setDatetimePicker] = useState(false)
    return (
        <>
            {
                Platform.OS == "ios" && <DateTimePicker
                    testID="dateTimePicker"
                    value={new Date(value)}
                    mode={"date"}

                    locale="tr"
                    is24Hour={true}
                    onChange={onChange}
                />
            }
            {

                Platform.OS != "ios" && <>
                    <TouchableOpacity style={{ padding: 5, backgroundColor: "#BDBDBD" }} onPress={() => setDatetimePicker(2)}>
                        <Text>{moment(activeDate).format("DD/MM/yyy")} </Text> 
                    </TouchableOpacity>
                    {datetimePicker == 2 && <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date(value)}
                        mode={"date"}
                        display="default"
                        locale="tr"
                        is24Hour={true}
                        onChange={(e,d)=>{onChange(e,d);setDatetimePicker(false)}}

                    />}
                </>
            }
        </>
    );
}

export default DatePicker;