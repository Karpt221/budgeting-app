class CustomError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = options.code || null;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async fetchData(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
          Authorization: `Bearer ${localStorage.getItem('budgeting-user-token')}`,
        },
      });
      const contentType = response.headers.get('content-type');
      console.log('Response status:', response.status);
      console.log('Content type:', contentType);

      if (!response.ok) {
        if (!contentType || !contentType.includes('application/json')) {
          const textError = await response.text();
          console.error('Non-JSON error:', textError);
          throw new Error(
            `API request failed: ${textError.substring(0, 100)}...`,
          );
        }
        const errorData = await response.json();
        throw new CustomError(errorData.message || 'API request failed', {
          code: errorData.code,
        });
      }
      const responseText = await response.text();
      if (!responseText.trim()) {
        console.error('Empty response received');
        throw new Error('Server returned empty response');
      }

      return await response.json();
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  }

  // Authentication methods
  async signUp(email, password) {
    return this.fetchData('/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  }

  async signIn(email, password) {
    return this.fetchData('/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async decodeToken(token) {
    return this.fetchData(`/auth/${token}`);
  }

  async getUserByID(user_id) {
    return this.fetchData(`/${user_id}`);
  }

  // Accounts methods
  async getAccounts(userId) {
    return this.fetchData(`/${userId}/accounts`);
  }

  async createAccount(userId, name, balance) {
    return this.fetchData(`/${userId}/accounts`, {
      method: 'POST',
      body: JSON.stringify({ name, balance }),
    });
  }

  async updateAccount(accountId, name) {
    return this.fetchData(`/users/accounts/${accountId}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }

  async deleteAccount(accountId) {
    return this.fetchData(`/users/accounts/${accountId}`, {
      method: 'DELETE',
    });
  }

  // Transactions methods
  async getTransactions(userId) {
    return this.fetchData(`/${userId}/transactions`);
  }

  async getTransactionsByAccount(accountId) {
    return this.fetchData(`/users/transactions/${accountId}`);
  }

  async createTransaction(accountId, transactionData) {
    return this.fetchData(`/users/transactions/${accountId}`, {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async updateTransaction(transactionId, updates) {
    return this.fetchData(`/users/transactions/${transactionId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTransactions(transactionIds) {
    return this.fetchData(`/users/transactions`, {
      method: 'DELETE',
      body: JSON.stringify({ transaction_ids: transactionIds }),
    });
  }

  // Categories methods
  async getReadyToAssign(userId) {
    return this.fetchData(`/${userId}/categories/ready-to-assign`);
  }

  async getAllCategories(userId) {
    return this.fetchData(`/${userId}/categories/all`);
  }

  async getCategories(userId) {
    return this.fetchData(`/${userId}/categories`);
  }

  async createCategory(user_id, category_name) {
    return this.fetchData(`/${user_id}/categories`, {
      method: 'POST',
      body: JSON.stringify({ user_id, category_name }),
    });
  }

  async updateCategory(categoryId, name, assigned) {
    return this.fetchData(`/users/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify({ name, assigned }),
    });
  }

  async deleteCategories(categoryIds) {
    return this.fetchData(`/users/categories/`, {
      method: 'DELETE',
      body: JSON.stringify({ category_ids: categoryIds }),
    });
  }

  //Reports

  async getSpendingsByCategories(filters) {
    return this.fetchData(`/users/reports/spending-breakdown`, {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  async getSpendingTrends(filters) {
    return this.fetchData(`/users/reports/spending-trends`, {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  // Target methods
  // async getTargetByCategoryId(categoryId) {
  //   return this.fetchData(`/users/categories/${categoryId}/target`);
  // }

  // async createTarget(categoryId, targetData) {
  //   return this.fetchData(`/users/categories/${categoryId}/target`, {
  //     method: 'POST',
  //     body: JSON.stringify(targetData),
  //   });
  // }

  // async updateTarget(categoryId, targetData) {
  //   return this.fetchData(`/users/categories/${categoryId}/target`, {
  //     method: 'PUT',
  //     body: JSON.stringify(targetData),
  //   });
  // }

  // async deleteTarget(categoryId) {
  //   return this.fetchData(`/users/categories/${categoryId}/target`, {
  //     method: 'DELETE',
  //   });
  // }
}

const apiService = new ApiService('/api');
export default apiService;
