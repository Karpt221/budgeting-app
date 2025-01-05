import styles from './Budget.module.css';
import PropTypes from 'prop-types';

const CategoryForm = ({errorMessage, action, onCancel, category }) => {

  function checkError(event) {
    if(errorMessage){
      event.preventDefault();
    }
  }
  return (
    <>
      <tr className={styles.addRow}>
        <td>
          {category && (
            <input
              type="hidden"
              name="category_id"
              value={category.category_id}
            />
          )}
          <input readOnly type="checkbox" checked={true} />
        </td>
        <td>
          <input
            type="text"
            name="category_name"
            placeholder="Category Name"
            required
            defaultValue={category?.category_name || ''}
          />
        </td>
        <td>
          {action === 'edit' ? (
            <input
            type="text"
            name="assigned"
            placeholder="Assigned"
            defaultValue={category?.assigned || ''}
            pattern="^-?[0-9]*$"
            onInput={(e) => {
              e.target.value = e.target.value.replace(/(?!^-)[^0-9]/g, '');
            }}
          />
          ) : ''}
          
        </td>
        <td colSpan="2"></td>
      </tr>
      <tr className={styles.addRow}>
        <td></td>
        <td>
          <button
            className={styles.cancelButton}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            name="action"
            value={action}
            className={styles.saveButton}
            type="submit"
            onClick={checkError}
          >
            Save
          </button>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </td>
        <td colSpan="3"></td>
      </tr>
    </>
  );
};

CategoryForm.propTypes = {
  action: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  category: PropTypes.shape({
    category_id: PropTypes.string,
    category_name: PropTypes.string,
    assigned: PropTypes.number,
  }),
};

export default CategoryForm;
