import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SelectSearch from 'react-select-search';
import Select from "react-dropdown-select";
import Switch from "react-switch";
import Button from 'react-bootstrap/Button'


const numSysOptions = [{ label: "Binär", value: 2 }, { label: "Oktal", value: 8 }, { label: "Dezimal", value: 10 }, { label: "Hexadezimal", value: 16 }];
const encodingOptions = [{ label: "ASCII (7 Bit)", value: 7 }, { label: "Unicode (UTF-8)", value: 8 }];

const emoji = require("emoji-dictionary");
let options = [];
for (let i = 0; i < emoji.unicode.length; i++) {
  let tmpDict = {}
  tmpDict["name"] = emoji.unicode[i] + " - " + emoji.getName(emoji.unicode[i]);
  tmpDict["value"] = emoji.unicode[i];

  options.push(tmpDict);
}
let skinTones = [];
skinTones.push({ name: "Skin Type 1-2", value: "\u{1f3fb}" })
skinTones.push({ name: "Skin Type 3", value: "\u{1f3fc}" })
skinTones.push({ name: "Skin Type 4", value: "\u{1f3fd}" })
skinTones.push({ name: "Skin Type 5", value: "\u{1f3fe}" })
skinTones.push({ name: "Skin Type 6", value: "\u{1f3ff}" })


function hex2emoji(emojis) {
  let code = ''
  for (let i = 0; i < emojis; i++) {
    code = code + String.fromCodePoint("0x" + emojis[i]) + String.fromCodePoint("0x" + "200d");
  }
  return code;
}

class EmojiFactory extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      translateText: '',
      selectedEmoji: '',
      utfCode: [],
      encodingFormat: '',
      numSys: '',
      codeSeparation: true,
      text: '',
      textCodes: [],
      inputDisabled: true,
      emojiText: '',
      lastSignZWJ: false,
      concatString: '',
      resetDisabled: true
    };
  }

  codeSeparationHandler = (event) => {
    this.setState({ codeSeparation: event });
  }

  translateTextHandler = (event) => {
    let text = event.target.value;
    this.setState({ text: text });

    let result = [];
    let len = Math.ceil(1.0 * Math.log(Math.pow(2, this.state.encodingFormat)) / Math.log(this.state.numSys));
    for (let i = 0; i < text.length; i++) {
      if (this.state.encodingFormat == 7 && parseInt(text[i].codePointAt(0).toString(16), 16) > 127) {
        result.push('?')
      } else {
        result.push(parseInt(text[i].codePointAt(0).toString(16), 16).toString(this.state.numSys).padStart(len, '0'));
      }

    }
    this.setState({ textCodes: result });
  }

  parseCodes() {
    let result = '';
    for (let i = 0; i < this.state.textCodes.length; i++) {
      result = result + this.state.textCodes[i];
      if (this.state.codeSeparation) {
        result = result + ' ';
      }
    }

    return result;
  }

  encodingHandler = (event) => {
    this.setState({ encodingFormat: event[0].value });
    if (this.state.numSys != '') {
      this.setState({ inputDisabled: false })
    }
  }

  numSysHandler = (event) => {
    this.setState({ numSys: event[0].value });
    if (this.state.encodingFormat != '') {
      this.setState({ inputDisabled: false })
    }
  }

  decodingHandler = (event) => {
    this.setState({ decodingFormat: event[0].label });
  }

  showStr2hex() {

    let result = []
    for (let i = 0; i < this.state.translateText.length; i++) {
      result.push(<span href=" " title={this.state.translateText[i]} className="word">{this.state.translateText[i].codePointAt(0).toString(16)}</span>);
    }
    return result;
  }

  showStrCodes() {
    let result = "";
    let len = Math.ceil(1.0 * Math.log(Math.pow(2, this.state.encodingFormat)) / Math.log(this.state.numSys));
    for (let i = 0; i < this.state.text.length; i++) {
      if (this.state.encodingFormat == 7 && parseInt(this.state.text[i].codePointAt(0).toString(16), 16) > 127) {
        result = result + '?'
      } else {
        result = result + parseInt(this.state.text[i].codePointAt(0).toString(16), 16).toString(this.state.numSys).padStart(len, '0');
      }
      if (this.state.codeSeparation) {
        result = result + " ";
      }
    }
    return result;
  }

  showStr() {
    return
  }

  showStr2utf8() {
    let arr = Array.from(this.state.translateText);
    let result = []
    for (let i = 0; i < arr.length; i++) {
      result.push(<span href=" " title={arr[i]} className="word">{arr[i]}</span>);
    }
    return result;
  }

  showStrRepresentation() {
    let arr = Array.from(this.state.translateText);

    if (this.state.decodingFormat == "ASCII") {
      for (let i = 0; i < arr.length; i++) {
        if (parseInt(arr[i].codePointAt(0).toString(16), 16) > 127) {
          arr[i] = "???";
        }
      }
      let result = []
      for (let i = 0; i < arr.length; i++) {
        result.push(<span href=" " title={arr[i]} className="word">{arr[i]}</span>);
      }
      return result;
    } else if (this.state.decodingFormat == "Unicode") {
      let result = []
      for (let i = 0; i < arr.length; i++) {
        result.push(<span href=" " title={arr[i]} className="word">{arr[i]}</span>);
      }
      return result;
    }


  }

  emojiSelectHandler = (event) => {
    this.setState({ emojiText: this.state.emojiText + event, concatString: this.state.concatString + " + " + event, resetDisabled: false});
  }

  skinToneSelectHandler = (event) => {
    this.setState({ emojiText: this.state.emojiText + event, concatString: this.state.concatString + " + " + event, resetDisabled: false});
  }

  zwjSelectHandler = () => {
    this.setState({ emojiText: this.state.emojiText + String.fromCodePoint("0x" + "200d"), concatString: this.state.concatString + " + ZWD", resetDisabled: false});
  }

  resetEmmojis = () => {
    this.setState({ emojiText: '', concatString: '', resetDisabled: true});

  }

  concatenatedEmojis = () => {
    if(this.state.emojiText.length > 0){
      return("= " + this.state.emojiText);
    } else{
      return("");
    }
  }
  showSelectedEmoji() {
    if (this.state.selectedEmoji.length > 0) {
      return (
        <div>
          <span className="emoji-span">{this.state.selectedEmoji}</span>
        </div>
      );
    } else {
      return;
    }


  }

  utfConvertHandler = (event) => {
    let arr = Array.from(event.target.value);
    this.setState({ utfCode: arr });
  }

  showUTFConversion() {
    let arr = [];
    for (let i = 0; i < this.state.utfCode.length; i++) {
      arr.push(this.state.utfCode[i].codePointAt(0).toString(16));
    }

    if (arr.length > 0) {
      let output = ''
      for (let i = 0; i < arr.length - 1; i++) {
        output += String.fromCodePoint("0x" + arr[i]) + String.fromCodePoint("0x" + "200d");
      }
      output += String.fromCodePoint("0x" + arr[arr.length - 1]);

      return <span className="emoji-span">{output}</span>;
    } else {
      return;
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-2"></div>
          <div className="col-lg-8 center-bar">
            <div className="text-right">Contact: <a href="mailto:hooljohannes@gmail.com">Johannes Hool</a></div>
            <div className="rounded text-center title-container">
              <h1>Zeichen und deren Codierung</h1>
            </div>
            <div className="col-lg-12">
              <div className="rounded text-center title-container">
                <h3>Zeichen übersetzen</h3>
              </div>
              <div className="row">
                <div className="col-md-4 vertical-center">
                  <Select className="select-input white-background" options={encodingOptions} onChange={this.encodingHandler} placeholder="Wähle Codierungssystem" />
                </div>
                <div className="col-md-4 vertical-center">
                  <Select className="select-input white-background" options={numSysOptions} onChange={this.numSysHandler} placeholder="Wähle Zahlensystem" />
                </div>
                <div className="col-md-4 vertical-center">
                  <span className="margin-right">Leerzeichen zwischen Zeichencodes </span>
                  <Switch onChange={this.codeSeparationHandler} checked={this.state.codeSeparation} />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="rounded text-center title-container-faded">
                    <h4>Zeichenkette</h4>
                  </div>
                  <textarea disabled={this.state.inputDisabled} type='text' class="flex-fill form-control prop-field auto-wrap" onChange={this.translateTextHandler} value={this.state.text} placeholder="Lege Codierungs- und Zahlensystem fest" />

                </div>
                <div className="col-lg-12">
                  <div className="rounded text-center title-container-faded">
                    <h4>Zeichencodes</h4>
                  </div>
                  <div className=" rounded auto-wrap">
                    {this.showStrCodes()}
                  </div>
                </div>

              </div>
            </div>


            <div className="col-lg-12">
              <div className="rounded text-center title-container">
                <h3>Emoji Generator</h3>
              </div>
              <div className="col-md-6">
                <div className="rounded text-center title-container-faded">
                  <h4>Zeichen hinzufügen</h4>
                </div>
                <b>Emoji hinzufügen</b>
                <SelectSearch options={options} onChange={this.emojiSelectHandler} search="true" placeholder="Suche" />
                <br></br><b>Hautfarbe hinzufügen</b>
                <SelectSearch options={skinTones} onChange={this.skinToneSelectHandler} search="true" placeholder="Suche" />
                <br></br><b>Zero Width Joiner hinzufügen</b><br></br>
                <Button size="sm" onClick={this.zwjSelectHandler}>ZWJ hinzufügen</Button>
              </div>
              <div className="col-md-6">
                <div className="rounded text-center title-container-faded">
                  <h4>Resultat</h4>
                </div>
                <div className="big-text">{this.state.concatString.substring(3)}</div>
                <div className="bigger-text">{this.concatenatedEmojis()}</div>
                <div className="margin-top">
                  <Button disabled={this.state.resetDisabled} size="sm" onClick={this.resetEmmojis}>Zurücksetzen</Button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// ============================================================

ReactDOM.render(
  <EmojiFactory />,
  document.getElementById('root')
);