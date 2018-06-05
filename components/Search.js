//components/Search.js
//import de la librairie react
import React from 'react'
//import des librairies pour utiliser les components dont on a besoin
import { StyleSheet, View, TextInput, Button, Text, FlatList } from 'react-native'
//import du fichiers contenant les datas qu'on veut afficher (ici via la FlatList)
import FilmItem from './FilmItem'
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi' // import { } from ... car c'est un export nommé dans TMDBApi.js


class Search extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            films: [],               // l'Api renvoi les films dans un tableau
            isLoading: false        // Par défaut à false car il n'y a pas de chargement tant qu'on ne lance pas de recherche
        }
    }


    //l'underscore "indique" que la méthode est privée
    _loadFilms() {
        if (this.searchedText.length > 0) {                                             // Seulement si le texte recherché n'est pas vide
            this.setState({isLoading : true})
            getFilmsFromApiWithSearchedText(this.searchedText).then(data => {          //lancement du chargement
                this.setState({ films: data.results,                                  //le tableau de données renvoyées par l'api s'appelle résults
                isLoading : false})                                                  //Arret du chargement
            })
        }
    }

    _searchTextInputChanged(text) {
        this.searchedText = text        // Modification du texte recherché à chaque saisie de texte, sans passer par le setState comme avant
    }

    _displayLoading() {
        if(this.stateisLoading){
            return (
                <View style = {styles.loading_container}>
                    <ActivityIndicator size = "large"/>      // choix entre large et small(par défaut)
                </View>
            )
        }
    }

  //la classe React.Component implémente une méthode render(return)
//  on doit obligatoirement ré-implémenter cet méthode et retourner
//  les éléments graphiques
    render() {
        console.log(this.state.isLoading);
        return (
            <View style={styles.main_container}>
                <TextInput style={styles.textinput}
                           placeholder='Titre du film'
                           onChangeText={(text) => this._searchTextInputChanged(text)}
                           onSubmitEditing={() => this._loadFilms()} />
                <Button style={{ height: 50 }} title='Rechercher' onPress={() => this._loadFilms()}/>
                //On utilise FlatList pour afficher une liste de données
                <FlatList
                    //on récupère les films du fichier filmsData
                    data={this.state.films}
                    keyExtractor={(item) => item.id.toString()}
                    //on définit notre prop qu'on va passer dans le fichier FilmItem
                    renderItem={({item}) => <FilmItem film={item}/>}
                />
                {this._displayLoading()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        marginTop: 20
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

export default Search