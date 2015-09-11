"use strict";

var SuggestionBox = React.createClass({
    render: function() {
        console.log(this.props.data);
        var currentPosition = this.props.position;
        var divStyle = {};
        if (currentPosition) {
            divStyle = {left: this.props.position.left + 30, top: this.props.position.top + 11}
        }
        return (
            <span className='suggestion-container' style={divStyle}>
                {this.props.data}
            </span>
        )
    }
});

var CommentBox = React.createClass({
    suggestionCache: {},

    getSuggestionData: function(q, comment, position) {
        if (this.suggestionCache[q]) {
            this.setState({
                suggestion: this.suggestionCache[q]
            });
        } else {
            console.log('query=' +q);
            $.ajax({
                url: this.props.url + 'query=' + q,
                dataType: 'json',
                cache: false,
                success: function (data) {
                    var suggestion = data.word;
                    if (suggestion) {
                        this.cache(q, suggestion);
                        this.setState({
                            suggestion: suggestion
                        });
                    } else {
                        this.setState({
                            comment: comment,
                            suggestion: ''
                        });
                    }
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        }
    },

    cache: function(key, value) {
        this.suggestionCache[key] = value;
    },

    handleCommentInput: function(e) {
        var content = e.target.textContent;
        var prefix = content.split(/\W/).slice(-1);

        if (e.keyCode == 9 && this.state.suggestion) {
            this.setState({
                comment: content + this.state.suggestion.substring(prefix.length),
                suggestion: ''
            });

            return
        }

        if (prefix[0] && prefix[0].length > 2) {
            this.getSuggestionData(prefix, content);
        } else {
            this.setState({
                comment: content,
                suggestion: ''
            })
        }
    },

    updatePosition: function(el) {
        this.setState({
            position: {
                left: el.target.pageX,
                top: el.target.pageY
            }
        });
    },

    getInitialState: function() {
        return {comment: '', suggestion:''};
    },

    render: function() {
        return (
            <div className="comment-container">
                <div ref="commentBox"
                     contentEditable={true}
                      className="comment-box"
                      value={this.state.comment}
                      onKeyUp={this.handleCommentInput}

                    />
                <SuggestionBox ref="suggestionBox"
                               data={this.state.suggestion}
                               position={this.state.position} />
            </div>
        );
    }
});