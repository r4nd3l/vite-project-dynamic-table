# Vite Dynamic Reusable Table

This project demonstrates a highly flexible, prop-driven table component in Vue 3, with configuration examples in `src/configs/`.

## Usage

1. **Import a table config and the table component:**
   ```ts
   import { ReusableTableConfiguration01 } from "./configs/ReusableTableConfig01";
   import ReusableTable from "./components/ReusableTable.vue";
   ```
2. **Use in your template:**
   ```vue
   <ReusableTable :config="ReusableTableConfiguration01" />
   ```

## Example Configs

- `ReusableTableConfig01.ts` / `ReusableTableConfig02.ts`: Basic static data, header, and class customization.
- `ReusableTableConfig03.ts`: Uses a custom row component.
- `ReusableTableConfig04.ts`: Uses a custom row component with row props and dynamic data.

## Features

- Static and dynamic data support
- Per-row, per-column, and per-cell class overrides
- Custom cell and row components
- Header customization

## File locations

- Table configs: `src/configs/ReusableTableConfig*.ts`
- Table component: `src/components/ReusableTable.vue`

---

For more, see the code comments in each config file.
