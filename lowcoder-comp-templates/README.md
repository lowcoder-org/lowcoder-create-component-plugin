# lowcoder-comp-templates

Layout template components for Lowcoder with native **InnerGrid** drop-zones.

Use these from the editor **Templates** panel. Add the published package name, then drag a layout onto the canvas and drop standard Lowcoder components into each zone.

## Components

| Key | Name | Drop-zones |
|-----|------|------------|
| `app_shell_layout` | App Shell Layout | Header + sidebar + content |
| `dashboard_layout` | Dashboard Layout | Header + KPI row + content |
| `chat_layout` | Chat Layout | Sidebar + messages + composer |

## Develop

```bash
cd lowcoder-comp-templates
yarn install
yarn start    # local preview on http://localhost:9001
yarn build    # build npm package
```

## Publish

```bash
yarn build_publish
```

Requires `npm login` and a unique package name on [npmjs.com](https://www.npmjs.com).

## Branch

This package lives on the `templates` branch of [lowcoder-create-component-plugin](https://github.com/lowcoder-org/lowcoder-create-component-plugin), alongside `kanban`, `gant-chart`, etc.
