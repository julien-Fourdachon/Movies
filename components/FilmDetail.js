//components/FilmsDetail

import React from 'react'
import {StyleSheet,
        View,
        Text,
        ActivityIndicator,
        ScrollView,
        Image,
        TouchableOpacity,
        Platform,
        Share,
        Alert
        } from 'react-native'
import {getFilmDetailFromApi, getImageFromApi} from "../API/TMDBApi";
import moment from 'moment'
import numeral from 'numeral'
import { connect } from 'react-redux'


    class FilmDetail extends React.Component {

        static navigationOptions = ({ navigation }) => {
            const { params } = navigation.state
            // On accède à la fonction shareFilm et au film via les paramètres qu'on a ajouté à la navigation
            if (params.film != undefined && Platform.OS === 'ios') {
                return {
                    // On a besoin d'afficher une image, il faut donc passe par une Touchable une fois de plus
                    headerRight: <TouchableOpacity
                        style={styles.share_touchable_headerrightbutton}
                        onPress={() => params.shareFilm()}>
                        <Image
                            style={styles.share_image}
                            source={require('../Images/ic_share.png')} />
                    </TouchableOpacity>
                }
            }
        }

        // Fonction pour faire passer la fonction _shareFilm et le film aux paramètres de la navigation. Ainsi on aura accès à ces données au moment de définir le headerRight
        _updateNavigationParams() {
            this.props.navigation.setParams({
                shareFilm: this._shareFilm,
                film: this.state.film
            })
        }



        constructor(props){
            super(props);
            this.state ={
                film: undefined,
                isLoading: true
            }
            // Ne pas oublier de binder la fonction _shareFilm sinon, lorsqu'on va l'appeler depuis le headerRight de la navigation, this.state.film sera undefined et fera planter l'application
            this._shareFilm = this._shareFilm.bind(this)
        }

        _displayLoading() {
            if (this.state.isLoading) {
                // Si isLoading vaut true, on affiche le chargement à l'écran
                return (
                    <View style={styles.loading_container}>
                        <ActivityIndicator size='large' />
                    </View>
                )
            }
        }

        componentDidMount(){
            const favoriteFilmIndex = this.props.favoritesFilm.findIndex(item => item.id === this.props.navigation.state.params.idFilm)
            if (favoriteFilmIndex !== -1) {                                 // Film déjà dans nos favoris, on a déjà son détail
                                                                          // Pas besoin d'appeler l'API ici, on ajoute le détail stocké dans notre state global au state de notre component
                this.setState({
                    film: this.props.favoritesFilm[favoriteFilmIndex]
                }, () => { this._updateNavigationParams() })
                return
            }
            // Le film n'est pas dans nos favoris, on n'a pas son détail
            // On appelle l'API pour récupérer son détail
            this.setState({ isLoading: true })

            getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
                this.setState({
                    film:data,
                    isLoading: false
                }, () => { this._updateNavigationParams() })
            })
        }

        componentWillReceiveProps(nextProps) {

        }


        _toggleFavorite(){
            const action = { type: "TOGGLE_FAVORITE", value: this.state.film }
            this.props.dispatch(action)
        }

        _displayFilm(){
            const { film } = this.state;
            if( film != undefined){
                return(
                <ScrollView style ={styles.scrollview_container}>
                    <Image style ={styles.image}
                           source={{uri: getImageFromApi(film.backdrop_path)}}
                    />            //définir une taille dans les styles sinon l'image ne s'affiche pas par défaut
                    <Text style ={styles.title}>{film.title}</Text>
                    <TouchableOpacity
                        style = {styles.favorite_container}
                        onPress ={() => this._toggleFavorite()}>
                        {this._displayFavoriteImage()}
                    </TouchableOpacity>
                    <Text style ={styles.description}>{film.overview}</Text>
                    <Text style ={styles.divers}>Sorti le {moment(new Date(film.release_date)).format('DD/MM/YY')}</Text>
                    <Text style ={styles.divers}>Note : {film.vote_average} / 10
                    </Text>
                    <Text style ={styles.divers}>Nombre de votes : {film.vote_count}
                    </Text>
                    <Text style ={styles.divers}>Budget : {numeral(film.budget).format('0,0[.]00 $')}
                    </Text>
                    <Text style={styles.divers}>Genre(s) : {film.genres.map(function(genre){
                        return genre.name;
                    }).join(" / ")}
                    </Text>
                        <Text style={styles.divers}>Companie(s) : {film.production_companies.map(function(company){
                            return company.name;
                        }).join(" / ")}
                        </Text>




                </ScrollView>
                )
            }
        }

        _displayFavoriteImage() {
            var sourceImage = require('../Images/ic_favorite.png')
            if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== 1) {     //film dans nos favoris
                sourceImage = require('../Images/ic_favorite_border.png')
            }
            return (
                <Image style = {styles.favorite_image}
                source = {sourceImage}/>

            )
        }

        _shareFilm() {
            const { film } = this.state
            Share.share({ title: film.title, message: film.overview })
                .then(
                    Alert.alert(
                        'Succès',
                        'Film partagé',
                        [
                            {text: 'OK', onPress: () => {}},
                        ]
                    )
                )
                .catch(err =>
                    Alert.alert(
                        'Echec',
                        'Film non partagé',
                        [
                            {text: 'OK', onPress: () => {}},
                        ]
                    )
                )
        }

        _displayFloatingActionButton() {
            const { film } = this.state
            if (film != undefined && Platform.OS === 'android') {
                return (
                    <TouchableOpacity
                        style={styles.share_touchable_floatingactionbutton}
                        onPress={() => this._shareFilm()}>
                        <Image
                            style={styles.share_image}
                            source={require('../Images/ic_share.png')} />
                    </TouchableOpacity>
                )
            }
        }


        render(){
            return(
                <View style = {styles.main_container}>
                    {this._displayLoading()}
                    {this._displayFilm()}
                    {this._displayFloatingActionButton()}

                </View>
            )
        }

    }

        const mapStateToProps = (state) => {
    return{
        favoritesFilm: state.favoritesFilm
    }
}



    const styles = StyleSheet.create({
        main_container:{
            flex:1
        },
        loading_container: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center'
        },
        scrollview_container:{
            flex: 1
        },
        image:{
            height: 185,
            margin: 5
        },
        title:{
            fontWeight: 'bold',
            fontSize: 26,
            textAlign: 'center',
            margin: 10,
            flexWrap: 'wrap'
        },
        description:{
            fontStyle: 'italic',
            color: '#999999',
            marginBottom: 10
        },
        divers: {
            margin: 5
        },

        favorite_container :{
            alignItems: 'center'
        },

        favorite_image:{
            width: 40,
            height: 40
        },

        share_touchable_floatingactionbutton: {
            position: 'absolute',
            width: 60,
            height: 60,
            right: 30,
            bottom: 30,
            borderRadius: 30,
            backgroundColor: '#e91e63',
            justifyContent: 'center',
            alignItems: 'center'
        },
        share_image: {
            width: 30,
            height: 30
        },
        share_touchable_headerrightbutton: {
            marginRight: 8
        }
    });


export default connect(mapStateToProps) (FilmDetail)