'use strict';

var React = require('react-native');
var { StyleSheet, Text, View, TextInput, Animated } = React;

var FloatingLabel = React.createClass({
  getInitialState: function() {
    var initialPadding = 9;
    var initialOpacity = 0;

    if (this.props.visible) {
      initialPadding = 5;
      initialOpacity = 1;
    }

    return {
      paddingAnim: new Animated.Value(initialPadding),
      opacityAnim: new Animated.Value(initialOpacity)
    };
  },

  componentWillReceiveProps: function(newProps) {
    Animated.timing(this.state.paddingAnim, {
      toValue: newProps.visible ? 5 : 9,
      duration: 230
    }).start();

    return Animated.timing(this.state.opacityAnim, {
      toValue: newProps.visible ? 1 : 0,
      duration: 230
    }).start();
  },

  render: function() {
    return(
      <Animated.View style={[styles.floatingLabel, {paddingTop: this.state.paddingAnim, opacity: this.state.opacityAnim}]}>
        {this.props.children}
      </Animated.View>
    );
  }
});

var TextFieldHolder = React.createClass({
  getInitialState: function() {
    return {
      marginAnim: new Animated.Value(this.props.withValue ? 10 : 0)
    };
  },

  componentWillReceiveProps: function(newProps) {
    return Animated.timing(this.state.marginAnim, {
      toValue: newProps.withValue ? 10 : 0,
      duration: 230
    }).start();
  },

  render: function() {
    return(
      <Animated.View style={{marginTop: this.state.marginAnim}}>
        {this.props.children}
      </Animated.View>
    );
  }
});

var FloatLabelTextField = React.createClass({
  getInitialState: function() {
    return {
      focussed: false,
      text: this.props.value
    };
  },

  getAdditionalStyle: function(name) {
    if (this.props.style && this.props.style[name])
    {
      return this.props.style[name];
    }

    return {};
  },

  render: function() {
    return(
      <View style={[styles.container, this.getAdditionalStyle('container')]}>
        <View style={[styles.viewContainer, this.getAdditionalStyle('viewContainer')]}>
          <View style={[styles.fieldContainer, this.getAdditionalStyle('fieldContainer')]}>
            <FloatingLabel visible={this.state.text}>
              <Text style={[styles.fieldLabel, 
                            this.getAdditionalStyle('fieldLabel'), 
                            this.labelStyle()]}>{this.placeHolderValue()}</Text>
            </FloatingLabel>
            <TextFieldHolder withValue={this.state.text}>
              <TextInput
                placeholder={this.props.placeholder}
                style={[styles.valueText, this.getAdditionalStyle('valueText')]}
                value={this.state.text}
                onFocus={this.setFocus}
                onBlur={this.unsetFocus}
                onChangeText={this.setText}
                onChange={this.props.onChange}
                secureTextEntry={this.props.secureTextEntry}
                keyboardType={this.props.keyboardType}
                autoCapitalize={this.props.autoCapitalize}
              />
            </TextFieldHolder>
          </View>
        </View>
      </View>
    );
  },
  
  setFocus: function() {
    this.setState({
      focussed: true
    });
    try {
      return this.props.onFocus();
    } catch (_error) {}
  },

  unsetFocus: function() {
    this.setState({
      focussed: false
    });
    try {
      return this.props.onBlur();
    } catch (_error) {}
  },

  labelStyle: function() {
    if (this.state.focussed) {
      return  this.props.style && this.props.style.focussed ? this.props.style.focussed : styles.focussed;
    }
  },

  placeHolderValue: function() {
    if (this.state.text) {
      return this.props.placeholder;
    }
  },

  setText: function(value) {
    this.setState({
      text: value
    });
    try {
      return this.props.onChangeTextValue(value);
    } catch (_error) {}
  },

  withMargin: function() {
    if (this.state.text) {
      return styles.withMargin;
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 45,
    justifyContent: 'center'
  },
  viewContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  floatingLabel: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  fieldLabel: {
    height: 10,
    fontSize: 9,
    color: '#B1B1B1',
    paddingLeft: 15
  },
  fieldContainer: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
    borderBottomWidth: 1 / 2,
    borderColor: '#C8C7CC',
    backgroundColor: 'white',
    paddingLeft: 15
  },
  valueText: {
    height: 20,
    fontSize: 16,
    color: '#111111'
  },
  withMargin: {
    marginTop: 10
  },
  focussed: {
    color: "#1482fe"
  }
});

module.exports = FloatLabelTextField;
