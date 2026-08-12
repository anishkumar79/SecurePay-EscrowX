import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Fallback mock database that uses localStorage for demo purposes if no credentials are provided
const createMockSupabase = () => {
  console.warn('Supabase URL or Anon Key is missing. Falling back to LocalStorage database.');

  const getTableData = (table) => {
    try {
      return JSON.parse(localStorage.getItem(`escrowx_db_${table}`) || '[]');
    } catch {
      return [];
    }
  };

  const setTableData = (table, data) => {
    localStorage.setItem(`escrowx_db_${table}`, JSON.stringify(data));
  };

  return {
    from: (table) => {
      return {
        select: (columns = '*') => {
          const data = getTableData(table);
          return {
            eq: (field, value) => {
              const filtered = data.filter(item => item[field] === value);
              return {
                data: filtered,
                error: null,
                single: () => ({
                  data: filtered[0] || null,
                  error: filtered[0] ? null : { message: 'Not found', code: 'PGRST116' }
                })
              };
            },
            order: (field, { ascending = true } = {}) => {
              const sorted = [...data].sort((a, b) => {
                if (a[field] < b[field]) return ascending ? -1 : 1;
                if (a[field] > b[field]) return ascending ? 1 : -1;
                return 0;
              });
              return { data: sorted, error: null };
            },
            data,
            error: null,
            single: () => ({
              data: data[0] || null,
              error: data[0] ? null : { message: 'Not found', code: 'PGRST116' }
            })
          };
        },
        insert: (rows) => {
          const current = getTableData(table);
          const newRows = Array.isArray(rows) 
            ? rows.map(r => ({ id: r.id || Date.now() + Math.random(), created_at: new Date().toISOString(), ...r }))
            : [{ id: rows.id || Date.now() + Math.random(), created_at: new Date().toISOString(), ...rows }];
          
          const updated = [...current, ...newRows];
          setTableData(table, updated);
          return { data: Array.isArray(rows) ? newRows : newRows[0], error: null };
        },
        update: (values) => {
          return {
            eq: (field, value) => {
              const current = getTableData(table);
              const updated = current.map(item => {
                if (item[field] === value) {
                  return { ...item, ...values };
                }
                return item;
              });
              setTableData(table, updated);
              return { data: values, error: null };
            }
          };
        },
        upsert: (rows) => {
          const current = getTableData(table);
          const rowList = Array.isArray(rows) ? rows : [rows];
          let updated = [...current];

          rowList.forEach(row => {
            // Match key: wallet_address or id
            const key = row.wallet_address ? 'wallet_address' : 'id';
            const index = updated.findIndex(item => item[key] === row[key]);
            const finalRow = { created_at: new Date().toISOString(), ...row };
            if (index > -1) {
              updated[index] = { ...updated[index], ...finalRow };
            } else {
              updated.push(finalRow);
            }
          });

          setTableData(table, updated);
          return { data: rows, error: null };
        }
      };
    }
  };
};

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabase();
