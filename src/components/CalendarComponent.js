import React from 'react';
// import WeeklyCalendar from 'react-native-weekly-calendar';
import styles from 'react-native-weekly-calendar/src/Style';
import moment from 'moment';
import { Text, View } from 'react-native';
import MyWeeklyCalendar from './MyWeeklyCalendar';

function CalendarComponent({setRefreshData,selectedDay,setSelectedDay,sampleEvents,fillCalendar}) {
    return (
        <>
               <MyWeeklyCalendar 
                    style={{ flex: 1 }}
                    events={sampleEvents}
                    selected={selectedDay}
                    startWeekday={7}
                    weekdayFormat='dd'
                    locale='tr'
                  

                    renderEvent={(event, j) => {
                        let startTime = moment(event.start).format('HH:mm').toString()
                        let duration = event.duration.split(':')
                        let seconds = parseInt(duration[0]) * 3600 + parseInt(duration[1]) * 60 + parseInt(duration[2])
                        let endTime = moment(event.start).add(seconds, 'seconds').format('HH:mm').toString()
                        return (
                            <View key={j}>
                                <View style={{...styles.event,backgroundColor:event.backColor}}>
                                    <View style={styles.eventDuration}>
                                        <View style={styles.durationContainer}>
                                            <View style={styles.durationDot} />
                                            <Text style={styles.durationText}>{startTime}</Text>
                                        </View>
                                        <View style={{ paddingTop: 10 }} />
                                        <View style={styles.durationContainer}>
                                            <View style={styles.durationDot} />
                                            <Text style={styles.durationText}>{endTime}</Text>
                                        </View> 
                                        <View style={styles.durationDotConnector} />
                                    </View>
                                    <View style={styles.eventNote}>
                                        <Text style={{...styles.eventText,color:"white"}}>{event.note}</Text>
                                    </View>
                                </View>
                                <View style={styles.lineSeparator} />
                            </View>
                        )
                    }}
                    renderLastEvent={(event, j) => {
                        let startTime = moment(event.start).format('HH:mm').toString()
                        let duration = event.duration.split(':')
                        let seconds = parseInt(duration[0]) * 3600 + parseInt(duration[1]) * 60 + parseInt(duration[2])
                        let endTime = moment(event.start).add(seconds, 'seconds').format('HH:mm').toString()
                        return (
                            <View key={j}>
                                 <View style={{...styles.event,backgroundColor:event.backColor}}>
                                    <View style={styles.eventDuration}>
                                        <View style={styles.durationContainer}>
                                            <View style={styles.durationDot} />
                                            <Text style={styles.durationText}>{startTime}  </Text>
                                        </View>
                                        <View style={{ paddingTop: 10 }} />
                                        <View style={styles.durationContainer}>
                                            <View style={styles.durationDot} />
                                            <Text style={styles.durationText}>{endTime}</Text>
                                        </View>
                                        <View style={styles.durationDotConnector} />
                                    </View>
                                    <View style={styles.eventNote}>
                                    <Text style={{...styles.eventText,color:"white"}}>{event.note}</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    }}
                    renderDay={(eventViews, weekdayToAdd, i) => {

                        //  if (eventViews.length==0) {
                        //     return (<View key={i.toString()}></View>)
                        //  }

                        return (

                            <View key={i.toString()} style={styles.day}>
                                <View style={styles.dayLabel}>
                                    <Text style={[styles.monthDateText, { color: 'blue' }]}>{weekdayToAdd.format('D').toString()}</Text>
                                    <Text style={[styles.dayText, { color: 'blue' }]}>{weekdayToAdd.format('ddd').toString()}</Text>
                                  
                                </View>
                                <View style={[styles.allEvents, eventViews.length === 0 ? { width: '100%', backgroundColor: 'pink' } : {}]}>
                                    {eventViews}
                                </View>
                            </View>
                        )
                    }}
                    onDayPress={(weekday, i) => {

                        fillCalendar(moment(new Date(weekday), "yyyy-MM-DD") ,moment(new Date(weekday), "yyyy-MM-DD").add(8, 'days'))
                        setSelectedDay(moment(new Date(weekday)).format("yyyy-MM-DD"))
                    }}
                    

                    themeColor='blue'
                     
                    onWeekChange={(weekday)=>{
                        fillCalendar(moment(new Date(weekday), "yyyy-MM-DD") ,moment(new Date(weekday), "yyyy-MM-DD").add(8, 'days'))
                        setSelectedDay(moment(new Date(weekday)).format("yyyy-MM-DD"))
                       
                     
                    }}
                    titleStyle={{ color: 'blue' }}
                    dayLabelStyle={{ color: 'green' } }
                />
        </>
    );
}

export default CalendarComponent;