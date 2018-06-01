//import de la librairie react
import React from 'react'
//import des librairies pour utiliser les components dont on a besoin
import { View, TextInput, Button } from 'react-native'


class Search extends React.Component {
  //la classe React.Component implémente une méthode render(return)
//  on doit obligatoirement ré-implémenter cet méthode et retourner
//  les éléments graphiques
  render(){
    return(
      //Ici on rend à l'écran les éléments graphiques de notre component custom
      <View style = {{ marginTop: 20}}>
        <TextInput style = {styles.TextInput} placeholder = "Titre du film"/>
        <Button style = {{ height: 50}} title = "Rechercher" onPress={() => {}}/>
      </View>
    )
  }
}

const styles = {
  TextInput: {
    marginLeft:5,
    marginRight: 5,
    height: 50,
    borderColor: '#000000',
    borderWidth:1,
    paddingLeft: 5
  }
}
export default Search
