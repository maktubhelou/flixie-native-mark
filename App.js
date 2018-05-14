import React from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import MovieDetails from './components/MovieDetails';
import MovieList from './components/MovieList';

const Routes = StackNavigator(
  {
    MovieList: {
      screen: MovieList,
      navigationOptions: {
        title: 'Welcome to Flixie',
      },
    },
    MovieDetails: {
      screen: MovieDetails,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
      }),
    }
  },
  {
    initialRouteName: 'MovieList'
  }
);

const movieDBSource = "https://api.themoviedb.org/";
const endpoint = "3/movie/popular?";
const apiKey = "api_key=a07e22bc18f5cb106bfe4cc1f83ad8ed&page=";
const pageCall = "&page=";

const newMovieCollectionRequest = movieDBSource + endpoint + apiKey + pageCall;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  }
});

export default class FetchExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      isLoading: true,
      movieDBList: [],
      filteredMovies: [],
      page: 1,
    };

    this.fetchNextPage = this.fetchNextPage.bind(this);
    this.filterMovies = this.filterMovies.bind(this);
  }

  componentDidMount() {
    this.fetchNextPage();
  }

  async fetchNextPage() {
    try {
      const query = newMovieCollectionRequest + this.state.page;
      const response = await fetch(query);
      const responseJson = await response.json();
      const mSet = new Set([...this.state.movieDBList.map((m) => m.id)]);
      const plusSet = responseJson.results.filter((m) => !mSet.has(m.id));
      const newResults = this.state.movieDBList.concat(plusSet);
      
      this.setState({
        isLoading: false,
        movieDBList: newResults,
        filteredMovies: newResults,
        page: this.state.page + 1
      });
    } catch(error) {
      alert('Your network has more bugs than a geckos!');
    }
  }

  filterMovies(text) {
    const allMovies = this.state.movieDBList;
    const filteredMovies = allMovies.filter(
      m => m.title.toLowerCase().indexOf(text.toLowerCase()) !== -1
    );

    this.setState({
      filteredMovies: filteredMovies,
      searchText: text,
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#888899" />
        </View>
      );
    }

    return (
      <Routes
        screenProps={{
          screenProps: this.state.searchText,
          movieDBList: this.state.movieDBList,
          filteredMovies: this.state.filteredMovies,
          filterMovies: this.filterMovies,
          page: this.state.page,
          isLoading: this.state.isLoading,
          fetchNextPage: this.fetchNextPage,
          refreshing: this.state.isLoading,
         }}
      />
    );
  }
}
