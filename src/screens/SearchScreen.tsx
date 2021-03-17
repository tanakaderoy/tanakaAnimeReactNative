import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Button, Divider} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons'
import { Subscription } from 'rxjs';
import api from '../api/api';
import ShowItem from '../components/ShowItem';
import { LatestShow } from '../models/LatestShow';
import {SearchStackParamList} from '../SearchStack';

interface SearchScreenProps extends StackScreenProps<SearchStackParamList> {}

const SearchScreen: React.FC<SearchScreenProps> = ({navigation}) => {
  const [query, setQuery] = useState('');
  const [shows,setShows] = useState<LatestShow[]>([])
  let sub:Subscription|undefined = undefined

  const peformSearch = () => {
   if (query.length>0){
    sub = api.searchShow(query).subscribe(results=>{
setShows(results)
     })
   }
  };

  useEffect(()=>{
    const unsubscribe = navigation.addListener('blur',()=>{
      sub?.unsubscribe()
    })
    return ()=> {
      unsubscribe();
    }
  },[navigation,sub])

  return (
    <View
      style={{
        flex: 1,
        marginHorizontal: 16,
      }}>
      <Divider style={{height: 1, backgroundColor: ' #e1e8ee'}} />
      <View style={{flexDirection: 'row'}}>
        <TextInput
          placeholder="...Enter Show Name"
          placeholderTextColor="black"
          value={query}
          onChangeText={text => setQuery(text)}
          onSubmitEditing={peformSearch}
          onEndEditing={peformSearch}
          style={{
            height: 50,
            flex: 1,
            padding: 8,
            borderWidth: 1,
            color: 'black'
          }}
        />
        <Button
          onPress={peformSearch}
          type="clear"
          icon={<Icon name="search" size={20} />}
        />
      </View>
      <FlatList
        data={shows}
        keyExtractor={it => it.url+ it.title+`${Math.random()* 9999}`}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Detail', {show: item});
              }}>
              <ShowItem show={item} />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});
