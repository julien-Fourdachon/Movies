//Navigation/Navigation.js
import React from 'react'
import{ createStackNavigator, createBottomTabNavigator } from 'react-navigation'
import  Search  from "../components/Search"
import FilmDetail from "../components/FilmDetail"
import Favorites from "../components/Favorites"
import Test from '../components/Test'
import { StyleSheet, Image } from 'react-native';


    const SearchStackNavigator = createStackNavigator({
        Search:{
            screen: Search,
            navigationOptions: {
                title: 'Rechercher'
            }
        },
        FilmDetail :{
            screen : FilmDetail

        }
    })

    const FavoritesStackNavigator = createStackNavigator ({
        Favorites :{
            screen : Favorites,
            navigationOptions: {
                title: 'Favoris'
            },
            FilmDetail: {
                screen: FilmDetail
            }
        }

})


const MoviesTabNavigator = createBottomTabNavigator(
    {

        Test: {
            screen: Test
        },

        Search: {
            screen: SearchStackNavigator,
            navigationOptions: {
                tabBarIcon: () => { // On définit le rendu de nos icônes par les images récemment ajoutés au projet
                    return <Image
                        source={require('../Images/ic_search.png')}
                        style={styles.icon}/> // On applique un style pour les redimensionner comme il faut
                }
            }
        },
        Favorites: {
            screen: Favorites,
            navigationOptions: {
                tabBarIcon: () => {
                    return <Image
                        source={require('../Images/ic_favorite.png')}
                        style={styles.icon}/>
                }
            }
        }
    },
    {
        tabBarPosition: 'bottom',
        tabBarOptions: {
            activeBackgroundColor: '#DDDDDD', // Couleur d'arrière-plan de l'onglet sélectionné
            inactiveBackgroundColor: '#FFFFFF', // Couleur d'arrière-plan des onglets non sélectionnés
            showLabel: false, // On masque les titres
            showIcon: true // On informe le TabNavigator qu'on souhaite afficher les icônes définis
        }
    }
)

const styles = StyleSheet.create({
    icon: {
        width: 30,
        height: 30
    }
})

export default MoviesTabNavigator