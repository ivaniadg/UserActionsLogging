class UserLogger {
    constructor(urlServer, maxActions, maxTime, attributesName, constantAttributes) {
        this.actions = [];
        this.maxActions = maxActions;
        this.server = urlServer;
        this.attributesName = attributesName;
        this.constantAttributes = constantAttributes;
        this.maxTime = maxTime ;
        this.setTimer()

    }

    setTimer() {
        let checkFunction = function (logger) {
            return function () {
                if (logger.actions.length > 0){
                    console.log("Time's up, sending all actions")
                    logger.sendActions(logger.actions)

                }
            }
        }
        setInterval(
            checkFunction(this), this.maxTime * 1000
        )
    }

    subscribeObject(selector) {
        let elements = document.querySelectorAll(selector)
        let logger = this
        elements.forEach(function (element) {
            let possibleAttributes = element.getAttributeNames()
            let usedAttributes = []
            possibleAttributes.forEach(function (attribute) {
                if (attribute.startsWith(logger.attributesName)) {
                    usedAttributes.push(attribute)
                }
            })

            element.addEventListener('click', function (event) {
                var action = {
                    'element_id': element.id, 'x': event.pageX, 'y': event.pageY,
                    'timestamp': Date.now()
                }
                for (var key in logger.constantAttributes) {
                    action[key] = logger.constantAttributes[key]
                }

                // If the data stored in the attributes was constant, this step could be done before
                usedAttributes.forEach(function (attribute) {
                    action[attribute] = element.getAttribute(attribute)
                })

                logger.actions.push(action)
                logger.checkSendActions()
            })


        })
    }

    addAction(action) {
        this.actions.push(this.addTimeStamp(action));
        for (let key in this.constantAttributes) {
            action[key] = this.constantAttributes[key]
        }
        this.checkSendActions()
    }

    checkSendActions() {
        if (this.actions.length >= this.maxActions) {
            console.log('Reached max actions.')
            this.sendActions(this.actions)
        }
    }

    addTimeStamp(action) {
        action['timestamp'] = Date.now()
        return action;
    }

    sendActions(actions) {
        fetch(this.server, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                // add authorization method. JWT is preferred
            },
            body: JSON.stringify(actions),
        })
            .then(response => {
                if (response.status == 200) {
                    console.log("Sent correctly")
                    this.actions = this.actions.slice(actions.length)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
}
