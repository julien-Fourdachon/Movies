//components/Search.js
//import de la librairie react
import React from 'react'
//import des librairies pour utiliser les components dont on a besoin
import { StyleSheet, View, TextInput, Button, Text, FlatList, ActivityIndicator, Keyboard } from 'react-native'
//import du fichiers contenant les datas qu'on veut afficher (ici via la FlatList)
import FilmItem from './FilmItem'
import FilmList from './FilmList'
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi' // import { } from ... car c'est un export nommé dans TMDBApi.js
import { connect } from 'react-redux'


class Search extends React.Component {

    constructor(props){
        super(props)
        this.searchedText =""
        this.page = 0                   // Compteur pour connaître la page courante
        this.totalPages = 0             // Nombre de pages totales pour savoir si on a atteint la fin des retours de l'API TMDB

        //API TMDB
        this.state = {
            films: [],               // l'Api renvoi les films dans un tableau
            isLoading: false        // Par défaut à false car il n'y a pas de chargement tant qu'on ne lance pas de recherche

            }

    }


    //l'underscore "indique" que la méthode est privée
    _loadFilms = () => {
        if (this.searchedText.length > 0) {                                             // Seulement si le texte recherché n'est pas vide
            this.setState({isLoading : true})
            getFilmsFromApiWithSearchedText(this.searchedText, this.page+1).then(data => {          //lancement du chargement
                this.page = data.page
                this.totalPages = data.total_pages
                this.setState({
                    films: [ ...this.state.films, ...data.results ],
                    //le tableau de données renvoyées par l'api s'appelle résults
                isLoading : false})                                                  //Arret du chargement
            })
        }
    }

    _serachFilms(){
        Keyboard.dismiss()

        this.page = 0
        this.totalPages = 0
        this.setState({
            films: [],
        }, () => {
           this._loadFilms()
        })

    }

    _searchTextInputChanged(text) {
        this.searchedText = text        // Modification du texte recherché à chaque saisie de texte, sans passer par le setState comme avant
    }

    _displayLoading() {
        if(this.state.isLoading){
            return (
                <View style = {styles.loading_container}>
                    <ActivityIndicator size = "large"/>      // choix entre large et small(par défaut)
                </View>
            )
        }
    }

    _displayDetailForFilm = (idFilm) => {
        console.log("Display film with id " + idFilm)
        this.props.navigation.navigate('FilmDetail', { idFilm: idFilm})
    }

  //la classe React.Component implémente une méthode render(return)
//  on doit obligatoirement ré-implémenter cet méthode et retourner
//  les éléments graphiques
    render() {
        console.log(this.props)
        return (
            <View style={styles.main_container}>
                <TextInput style={styles.textinput}
                           placeholder='Titre du film'
                           onChangeText={(text) => this._searchTextInputChanged(text)}
                           onSubmitEditing={() => this._serachFilms()} />
                <Button style={{ height: 50 }} title='Rechercher' onPress={() => this._serachFilms()}/>
                <FilmList
                    films={this.state.films} // C'est bien le component Search qui récupère les films depuis l'API et on les transmet ici pour que le component FilmList les affiche
                    navigation={this.props.navigation} // Ici on transmet les informations de navigation pour permettre au component FilmList de naviguer vers le détail d'un film
                    loadFilms={this._loadFilms} // _loadFilm charge les films suivants, ça concerne l'API, le component FilmList va juste appeler cette méthode quand l'utilisateur aura parcouru tous les films et c'est le component Search qui lui fournira les films suivants
                    page={this.page}
                    totalPages={this.totalPages} // les infos page et totalPages vont être utile, côté component FilmList, pour ne pas déclencher l'évènement pour charger plus de film si on a atteint la dernière page
                    favoriteList={false} // Ici j'ai simplement ajouté un booléen à false pour indiquer qu'on n'est pas dans le cas de l'affichage de la liste des films favoris. Et ainsi pouvoir déclencher le chargement de plus de films lorsque l'utilisateur scrolle.
                />
                {this._displayLoading()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1
    },
    textinput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5
    },

    loading_container: {
        position : 'absolute',
        left : 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

const mapStateToProps = (state) => {
    return{
        favoritesFilm: state.favoritesFilm
    }
};

export default connect(mapStateToProps)(Search)