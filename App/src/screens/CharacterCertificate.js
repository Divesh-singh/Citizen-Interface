import React, { useEffect, Component, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  ImageBackground,
  ImageBackgroundComponent,
  Platform,
  PermissionsAndroid,
  Alert
} from "react-native";
import { Header } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Dropdown } from "react-native-material-dropdown";
import DatePicker from "react-native-datepicker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import * as firebase from "firebase";
let States = [];
let District = [];
let station = [];
let User = [];
var photo;
export default class CharacterCertificate extends Component {
  state = {
    Name: "",
    Father_name: "",
    Address: "",
    Mobile: "",
    Email: "",
    DOB: "",
    Station: "",
    State: "",
    District: "",
    Gender: "",
    Request_type: "",
    Purpose: "",
    ID_type: "",
    ID: "",
    Receiving: "",
    TAN: "",
    // longitude: "",
    // latitude: "",
    //User
    User_Name: "",
    User_Aadhar: "",
    User_Email: "",
    User_Number: "",
    User_Token: "",
    errorMessage: null
  };

  handleSubmit = () => {
    firebase
      .database()
      .ref("/Character")
      .push(this.state)
      .then(this.props.navigation.navigate("Form"));
  };
  fetchDataUser = async () => {
    var fireBaseResponse = firebase
      .database()
      .ref("Citizen Users/")
      .child(firebase.auth().currentUser.email.replace(".", "@"));
    fireBaseResponse.once("value").then(snapshot => {
      snapshot.forEach(child => {
        var temp = child.val();
        User.push(temp);
        return false;
      });
      (this.state.User_Name = User[2]),
        (this.state.User_Aadhar = User[0]),
        (this.state.User_Email = User[1]),
        (this.state.User_Number = User[3]),
        (this.state.User_Token = User[4]);
    });
  };
  ///-----------------------Location Fetch-----------------------

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        locationResult: "Permission to access location was denied"
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });
  };
  //-------------------------------Location taken--------------------------
  componentWillMount() {
    this.fetchDataStates();
  }
  fetchDataStates = async () => {
    var fireBaseResponse = firebase
      .database()
      .ref()
      .child("Stations");
    fireBaseResponse.once("value").then(snapshot => {
      snapshot.forEach(child => {
        var temp = child.key;
        States.push({ value: temp });
        return false;
      });
      // console.log(States);
    });
  };
  fetchDataDistrict = async () => {
    var fireBaseResponse = firebase
      .database()
      .ref("Stations")
      .child(this.state.State);
    fireBaseResponse.once("value").then(snapshot => {
      snapshot.forEach(child => {
        var temp = child.key;
        District.push({ value: temp });
        return false;
      });
      // console.log(District);
    });
  };
  fetchDataStation = async () => {
    var fireBaseResponse = firebase
      .database()
      .ref("Stations/" + this.state.State)
      .child(this.state.District);
    fireBaseResponse.once("value").then(snapshot => {
      snapshot.forEach(item => {
        var temp = item.key;
        station.push({ value: temp });
        return false;
      });
      // console.log(station);
    });
  };

  chooseImage = async () => {
    //let result=await ImagePicker.launchCameraAsync();
    let result = await ImagePicker.launchImageLibraryAsync();

    // this.setState({ image:blob.data.name })
    if (!result.cancelled) {
      this.uploadImage(result.uri, this.state.PAN + "/")
        .then(() => {
          Alert.alert("Success");
        })
        .catch(error => {
          Alert.alert(error);
        });
    }
  };
  uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    blob = await response.blob();
    var ref = firebase
      .storage()
      .ref("Character/")
      .child(imageName);
    // firebase
    // .database()
    // .ref("Tenant/")
    // .push({image:blob.data.name});
    photo = blob.data.name;
    return ref.put(blob);
  };

  render() {
    this.fetchDataUser();
    this.fetchDataDistrict();
    this.fetchDataStation();
    // this._getLocationAsync();
    let req = [
      {
        value: "Normal"
      },
      {
        value: "Contractor"
      }
    ];
    let data = [
      {
        value: "Female"
      },
      {
        value: "Male"
      },
      {
        value: "Other"
      }
    ];
    let id = [
      {
        value: "Aadhar card(IMU)"
      },
      {
        value: "PAN card"
      },
      {
        value: "Driver`s license"
      },
      {
        value: "Passport"
      },
      {
        value: "Voter`s card"
      },
      {
        value: "Ration card"
      },
      {
        value: "Arms license"
      }
    ];
    let data2 = [
      {
        value: "Through post"
      },
      {
        value: "By person"
      },
      {
        value: "Wireless"
      }
    ];
    console.log(firebase.auth().currentUser.email);
    return (
      <ImageBackground
        source={require("../../assets/background.jpg")}
        style={{ width: "100%", height: "100%" }}
      >
        <Header
          leftComponent={{
            icon: "arrow-back",
            color: "#fff",
            onPress: () => this.props.navigation.navigate("Form")
          }}
          centerComponent={{
            text: "Character Certificate",
            style: {
              color: "#fff",
              fontWeight: "bold",
              fontSize: 18,
              letterSpacing: 1
            }
          }}
          rightComponent={{
            icon: "help",
            color: "#fff",
            onPress: () =>
              Alert.alert(
                "INFO",
                "Now a days many competitive exams asked for the Character Certificate from the contenders. Candidates should have the character certificates for applying any exam in which may require for the certificates. It should be verified by any Authorized Officer, which is blood-related to you. You can apply for the form online also, this involves few easy steps and at the end, you will have your character certificate which you.\nCharacter Certificate is legal and simple steps to figure out the identity of the common man. This can be asked during appearing in the exam, taking admission in any college, joining of job etc. Character Certificate is now mostly used making the identity of any man for any proposes. You can ask for the format form respective organization and fill it out and get verified by any gazetted officer.\n\n\u2022Who can verify Character Certificate?\nIf you need character certificate, the best person who will issued you a character certificate are College Employee, Local Counselor, Authorized Officer and other reputed person who is not related to you.\n"
              )
          }}
          backgroundColor="#1C8ADB"
        />
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled
        >
          <ScrollView>
            <View style={styles.entrybox}>
              <Text style={styles.text}>Request type</Text>
              <Dropdown
                style={styles.drop}
                onChangeText={Request_type => this.setState({ Request_type })}
                value={this.state.Request_type}
                baseColor="#1C8ADB"
                data={req}
              />
            </View>
            <View style={styles.entrybox}>
              <Text style={styles.text}>State</Text>
              <Dropdown
                style={styles.drop}
                onChangeText={State => this.setState({ State })}
                value={this.state.State}
                baseColor="#1C8ADB"
                data={States}
              />
            </View>
            <View style={styles.entrybox}>
              <Text style={styles.text}>District</Text>
              <Dropdown
                style={styles.drop}
                onChangeText={District => this.setState({ District })}
                value={this.state.District}
                baseColor="#1C8ADB"
                data={District}
              />
            </View>
            <View style={styles.entrybox}>
              <Text style={styles.text}>Police Station</Text>
              <Dropdown
                style={styles.drop}
                onChangeText={Station => this.setState({ Station })}
                value={this.state.Station}
                baseColor="#1C8ADB"
                data={station}
              />
            </View>
            <View style={styles.entrybox}>
              <Text style={styles.text}>Full name</Text>
              <TextInput
                style={styles.input}
                placeholder="Full name"
                autoCompleteType="name"
                autoCapitalize="words"
                placeholderTextColor="#000"
                onChangeText={Name => this.setState({ Name })}
                value={this.state.Name}
              />
            </View>
            <View style={styles.entrybox}>
              <Text style={styles.text}>Father`s/Gaurdian`s name</Text>
              <TextInput
                style={styles.input}
                placeholder="Father`s/Gaurdian`s name"
                autoCompleteType="name"
                autoCapitalize="words"
                placeholderTextColor="#000"
                onChangeText={Father_name => this.setState({ Father_name })}
                value={this.state.Father_name}
              />
            </View>
            <View style={styles.entrybox}>
              <Text style={styles.text}>Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Address"
                multiline
                placeholderTextColor="#000"
                onChangeText={Address => this.setState({ Address })}
                value={this.state.Address}
              />
            </View>
            <View style={styles.entrybox}>
              <Text style={styles.text}>Mobile Number</Text>
              <TextInput
                numeric
                style={styles.input}
                keyboardType="phone-pad"
                placeholder="Mobile Number"
                placeholderTextColor="#000"
                onChangeText={Mobile => this.setState({ Mobile })}
                value={this.state.Mobile}
              />
            </View>

            <View style={styles.entrybox}>
              <Text style={styles.text}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                autoCompleteType="email"
                placeholderTextColor="#000"
                onChangeText={Email => this.setState({ Email })}
                value={this.state.Email}
              />
            </View>
            <View style={styles.entrybox}>
              <Text style={styles.text}>Date Of Birth</Text>
              <DatePicker
                style={{ width: 200, backgroundColor: "#1C8ADB" }}
                date={this.state.DOB}
                mode="date"
                placeholder="Select Date"
                placeholderTextColor="black"
                format="YYYY-MM-DD"
                minDate="2016-05-01"
                maxDate="2019-06-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: "absolute",
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                }}
                onDateChange={DOB => {
                  this.setState({ DOB });
                }}
              />
            </View>
            <View style={styles.entrybox}>
              <Text style={styles.text}>ID Type</Text>
              <Dropdown
                style={styles.drop}
                onChangeText={ID_type => this.setState({ ID_type })}
                value={this.state.ID_type}
                baseColor="#1C8ADB"
                data={id}
              />
            </View>
            <View style={styles.entrybox}>
              <Text style={styles.text}>ID Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Address"
                placeholderTextColor="#000"
                onChangeText={ID => this.setState({ ID })}
                value={this.state.ID}
              />
            </View>
            <View style={styles.entrybox}>
              <Text style={styles.text}>Purpose</Text>
              <TextInput
                style={styles.input}
                multiline
                placeholder="Purpose"
                placeholderTextColor="#000"
                onChangeText={Purpose => this.setState({ Purpose })}
                value={this.state.Purpose}
              />
            </View>
            <View style={styles.entrybox}>
              <Text style={styles.text}>Gender</Text>
              <Dropdown
                style={styles.drop}
                onChangeText={Gender => this.setState({ Gender })}
                value={this.state.Gender}
                baseColor="#1C8ADB"
                data={data}
              />
            </View>
            <View style={styles.entrybox}>
              <Text style={styles.text}>Receiving Type</Text>
              <Dropdown
                style={styles.drop}
                onChangeText={Receiving => this.setState({ Receiving })}
                value={this.state.Receiving}
                baseColor="#1C8ADB"
                data={data2}
              />
            </View>
            <View style={styles.entrybox}>
              <Text style={styles.text}>TAN Number</Text>
              <TextInput
                style={styles.input}
                numeric
                placeholder="Number"
                placeholderTextColor="#000"
                onChangeText={TAN => this.setState({ TAN })}
                value={this.state.TAN}
              />
            </View>
            <View style={styles.entrybox}>
              <Text style={styles.text}>Requester Photo</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={this.chooseImage}
              >
                <Text
                  style={{ color: "#FFF", fontWeight: "400", fontSize: 22 }}
                >
                  Upload
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.text}>Note:</Text>
            <View style={{ paddingBottom: 20 }}>
              <Text>File Should of 5mb.</Text>
              <Text>File should be in .jpg or .png format.</Text>
            </View>

            <View style={{ paddingBottom: 100 }}>
              <TouchableOpacity
                style={styles.button}
                onPress={this.handleSubmit}
              >
                <Text
                  style={{ color: "#FFF", fontWeight: "400", fontSize: 22 }}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 8,
    paddingTop: 50
  },
  split: {
    flexDirection: "row"
  },
  error: {
    position: "absolute",
    bottom: 0,
    color: "red",
    fontSize: 12
  },
  // map: {
  //   padding: 100,
  //   justifyContent: "flex-end",
  //   alignItems: "center"
  // },
  text: {
    color: "#1C8ADB",
    fontWeight: "bold",
    fontSize: 22
  },
  form: {
    flex: 1,
    marginBottom: 60,
    marginHorizontal: 30
  },
  input: {
    borderBottomColor: "#1C8ADB",
    borderBottomWidth: 2,
    height: 40,
    fontSize: 20,
    color: "black"
  },
  drop: {
    fontSize: 20
  },
  entrybox: {
    flex: 1,
    marginHorizontal: 10,
    marginBottom: 20
  },
  button: {
    backgroundColor: "#1C8ADB",
    borderRadius: 40,
    height: 50,
    marginHorizontal: "10%",
    alignItems: "center",
    justifyContent: "center"
  }
});
