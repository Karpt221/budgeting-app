import styles from './Budget.module.css';
import { useLoaderData, Form } from 'react-router-dom';
import AddIcon from './AddIcon';
import DeleteIcon from './DeleteIcon';
import { useState, useEffect } from 'react';
import CategoryForm from './CategoryForm';

function Budget() {
  const categoriesData = useLoaderData();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isAddCategoryFormOpen, setIsAddCategoryFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const readyToAssign = categoriesData.readyToAssign;

  console.log('categoriesData.readyToAssign',categoriesData.readyToAssign);

  useEffect(() => {
    setIsAddCategoryFormOpen(false);
    setEditingCategory(null);
  }, [categoriesData]);

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setSelectedCategories(
      checked ? categoriesData.categories.map((c) => c.category_id) : [],
    );
  };

  const handleSelectCategory = (categoryId) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId],
    );
  };

  const handleRowClick = (category) => {
    if (selectedCategories.includes(category.category_id)) {
      setEditingCategory(category);
    } else {
      setSelectedCategories([category.category_id]);
      setEditingCategory(null);
    }
  };

  const handleAddFormOpen = () => {
    setIsAddCategoryFormOpen(true);
    setSelectedCategories([]);
    setEditingCategory(null);
  };

  return (
    <>
      <div className={styles.categoriesTitle}>
        <div className={styles.categoriesTitleReadyToAssignContainer}>
          <span className={styles.categoriesTitleReadyToAssignAmount}>
            {readyToAssign} $
          </span>
          <span className={styles.categoriesTitleReadyToAssignText}>
            Ready to Assign
          </span>
        </div>
      </div>
      <hr />
      <div className={styles.categoriesToolbar}>
        <button onClick={handleAddFormOpen}>
          <AddIcon /> Add Category
        </button>
        <Form method="post" action="">
          <input
            type="hidden"
            name="category_ids"
            value={JSON.stringify(selectedCategories)}
          />
          <button
            disabled={selectedCategories.length === 0}
            className={
              selectedCategories.length === 0
                ? styles.disabledButton
                : styles.deleteButton
            }
            name="action"
            value="delete"
            type="submit"
          >
            <DeleteIcon /> Delete
          </button>
        </Form>
      </div>
      <Form method="post" action="">
        <table>
          <thead>
            <tr>
              <th className={styles.centered}>
                <input
                  type="checkbox"
                  name="selectAll"
                  onChange={handleSelectAll}
                  checked={
                    selectedCategories.length ===
                    categoriesData.categories.length
                  }
                />
              </th>
              <th>Category Name</th>
              <th>Assigned</th>
              <th>Activity</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {isAddCategoryFormOpen && (
              <CategoryForm
                action="create"
                onCancel={() => setIsAddCategoryFormOpen(false)}
              />
            )}
            {categoriesData.categories.map((category) =>
              editingCategory &&
              editingCategory.category_id === category.category_id ? (
                <CategoryForm
                  key={category.category_id}
                  action="edit"
                  onCancel={() => setEditingCategory(null)}
                  category={editingCategory}
                />
              ) : (
                <tr
                  key={category.category_id}
                  onClick={() => handleRowClick(category)}
                  className={
                    selectedCategories.includes(category.category_id)
                      ? styles.selectedRow
                      : ''
                  }
                >
                  <td className={styles.centered}>
                    <input
                      readOnly
                      type="checkbox"
                      checked={selectedCategories.includes(
                        category.category_id,
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCategory(category.category_id);
                      }}
                    />
                  </td>
                  <td>{category.category_name}</td>
                  <td>{category.assigned} $</td>
                  <td>{category.activity} $</td>
                  <td>{category.available} $</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </Form>
    </>
  );
}

export default Budget;
