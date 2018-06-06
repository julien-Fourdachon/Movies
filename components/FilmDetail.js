//components/FilmsDetail

import React from 'react'
import {StyleSheet,
        View,
        Text,
        ActivityIndicator,
        ScrollView,
        Image
        } from 'react-native'
import {getFilmDetailFromApi, getImageFromApi} from "../API/TMDBApi";
import moment from 'moment'
import numeral from 'numeral'


    class FilmDetail extends React.Component {

        constructor(props){
            super(props);
            this.state ={
                film: undefined,
                isLoading: true
            }
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
            console.log("Component FilmDétail monté");
            getFilmDetailFromApi(this.props.navigation.state.params.idFilm).then(data => {
                this.setState({
                    film:data,
                    isLoading: false
                })
            })
        }

        _displayFilm(){
            console.log('on affiche le titre');
            const { film } = this.state;
            if( film != undefined){
                return(
                <ScrollView style ={styles.scrollview_container}>
                    <Image style ={styles.image}
                           source={{uri: getImageFromApi(film.backdrop_path)}}
                    />            //définir une taille dans les styles sinon l'image ne s'affiche pas par défaut
                    <Text style ={styles.title}>{film.title}</Text>
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

        render(){
            console.log("component FilmDétail rendu");
            return(
                <View style = {styles.main_container}>
                    {this._displayLoading()}
                    {this._displayFilm()}
                </View>
            )
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
        }
    });

export default FilmDetail