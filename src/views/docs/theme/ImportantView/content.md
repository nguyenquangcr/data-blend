# Important

##### A few points to note on the project.

---

#### Import from Material-UI

Because we follow [minimizing bundle size](https://next.material-ui.com/guides/minimizing-bundle-size/) to optimize load performance,
we need to strictly adhere to the following when importing:

🟢 OK

```js
import { alpha } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { capitalize } from '~/utils/formatText';
import { Button, AppBar, Hidden, Toolbar, IconButton } from '@mui/material';
```

🔴 NOT OK (Would include all of `@material-ui/core`)

```js
import {
  alpha,
  Button,
  AppBar,
  Hidden,
  Toolbar,
  capitalize
  makeStyles,
  IconButton,
} from '@mui/material';
```

#### Similar to Lodash

🟢 OK

```js
import { merge, makeStyles } from 'lodash';

merge(object, other);
```

🔴 NOT OK (Do not should include all in `lodash`)

```js
import _ from 'lodash';

_.merge(object, other);
```

**You can redefine the rule you want here**
`.babelrc`

```json
{
  "presets": ["babel-preset-react-app"],
  "plugins": [
    [
      "babel-plugin-root-import",
      {
        "rootPathPrefix": "~",
        "rootPathSuffix": "src"
      }
    ],
    [
      "transform-imports",
      {
        "@material-ui/core": {
          "transform": "@material-ui/core/${member}",
          "preventFullImport": true
        },
        "@material-ui/icons": {
          "transform": "@material-ui/icons/${member}",
          "preventFullImport": true
        },
        "lodash": {
          "transform": "lodash/${member}",
          "preventFullImport": true
        }
      }
    ]
  ]
}
```
