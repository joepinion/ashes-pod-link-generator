const BACKEND_HOST = 'http://l.plaidhatgames.com:8002';

const AshesPodLinkGenerator = {
    getProducts: () => {
        return new Promise(resolve=>{
            backendPromise(
                `${BACKEND_HOST}/ashes-cart-link/products/`,
                'GET',
            ).then(r=>resolve(r))
        })
    },
    getLink: (product, options={}) => {
        return new Promise(resolve=>{
            let o = {
                sku: product,
                return_to: options.return_to,
            }
            if(options.title) {
                o.title = options.title;
            }
            if(options.cards) {
                o.cards = options.cards;
            }
            backendPromise(
                `${BACKEND_HOST}/ashes-cart-link/buy/`,
                'POST',
                null,
                o,
            ).then(r=>resolve(r)) 
        });
    },
    DICE_REFERENCE_CARDS: {
        artifice: "Artifice Magic",
        astral: "Astral Magic",
        ceremonial: "Ceremonial Magic",
        charm: "Charm Magic",
        divine: "Divine Magic",
        illusion: "Illusion Magic",
        natural: "Natural Magic",
        sympathy: "Sympathy Magic",
        time: "Time Magic",
    }
};

export default AshesPodLinkGenerator;

function backendPromise(whereto, method='GET', csrftoken=null, body=null) {
    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };
    if(csrftoken) {
        headers['X-CSRFToken'] = csrftoken;
    }
    let req_opt = {
        method: method,
        headers: headers,
    };
    if(body) {
        req_opt['body'] = JSON.stringify(body);
    }
    return new Promise(resolve=>{
        try {
            fetch(
                whereto,
                req_opt,
            ).then(r => {
                if (r.status === 200 && r.ok === true) {
                    r.json().then((d) => {
                        resolve(d);
                    });
                } else {
                    resolve({
                        ok: false,
                        message: str.formatString(str["errorServerReturnedCode"], r.status, r.statusText),
                    });
                }

            }).catch(error => {
                resolve({
                    ok: false,
                    message: str.formatString(str["errorServerReturnedCode"], '0', 'Network error.'),
                });
            });
        } catch(error) {
            resolve({
                ok: false,
                message: str["Failed to fetch"],
            });
        }
    });
}