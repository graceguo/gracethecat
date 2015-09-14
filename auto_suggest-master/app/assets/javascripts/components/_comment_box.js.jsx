"use strict";

var SuggestionBox = React.createClass({
    render: function() {

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

    getSuggestionData: function(q, comment) {
        if (this.suggestionCache[q]) {
            this.setState({
                comment: comment,
                suggestion: this.suggestionCache[q]
            });
        } else {

            $.ajax({
                url: this.props.url + 'query=' + q,
                dataType: 'json',
                cache: false,
                success: function (data) {
                    var suggestion = data.word;
                    if (suggestion) {
                        this.cache(q, suggestion);
                        this.setState({
                            comment: comment,
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
        var content = e.target.value;
        var prefix = content.split(/\W/).slice(-1)[0];
        if (prefix && prefix.length > 2) {
            this.getSuggestionData(prefix, content);
        } else {
            this.setState({
                comment: content,
                suggestion: ''
            })
        }
    },

    handleKeyPress: function(e) {
        var key = e.keyCode;
        if (key !== 9) {
            return;

        } else if (key === 9 && this.state.suggestion) {
            e.preventDefault();
            var content = e.target.value;
            var prefix = content.split(/\W/).slice(-1)[0];
            var updatedComment = content + this.state.suggestion.substring(prefix.length);
            this.setState({
                comment: updatedComment,
                suggestion: ''
            });
        }
    },

    getInitialState: function() {
        return {comment: '', suggestion:''};
    },

    render: function() {
        return (
            <div className="comment-container">
                <textarea ref="commentBox"
                      className="comment-box"
                      value={this.state.comment}
                      onChange={this.handleCommentInput}
                      onKeyDown={this.handleKeyPress}
                    />
                <SuggestionBox ref="suggestionBox"
                               data={this.state.suggestion}
                               position={this.state.position} />
            </div>
        );
    }
});