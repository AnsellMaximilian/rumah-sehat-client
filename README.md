# Car Workshop Sales System for Bengkel Sogo Jaya AC

## Background

The purpose of this document is to provide a technical overview of a React client used to consume an API for a sales system. This client is designed to allow users to manage customers, products, suppliers, deliveries, invoices, purchases, invoice adjustments, and other relevant information. The client is built using React and Material UI.

## Requirements and Functionalities

The following are the requirements of the React client:

- Generic Module:
The Generic Module should allow the user to create, update, and delete customer information. This functionality enables users to keep track of their customers and manage their information easily.

- Regular Produces Module:
The Regular Produces Module should enable users to create, update, and delete product information. This functionality enables users to manage their products and their suppliers efficiently. The module should also allow users to manage deliveries, invoices, purchases, invoice adjustments, and display each data model in a table. Users should be able to cycle through invoice status by the invoice index table. The module should also display important metrics in the dashboard, such as purchases that need to be sold to a certain customer, invoice adjustments that need to be applied, and invoices that are still in draft mode. Users should be able to manage invoices and deliveries easily in a single page. The module should also allow users to generate reports, such as Total purchases, total profits, which should be able to be filtered by certain parameters. Users should also be able to automatically generate multiple invoice pdfs.

- Beauty Products Module:
The Beauty Products Module should enable users to create, update, and delete items, deliveries, invoices, and discount models. This functionality enables users to manage their beauty products and their suppliers efficiently. The module should also display each data model in a table. Users should be able to cycle through invoice status by the invoice index table. Users should be able to manage invoices and deliveries easily in a single page. The module should also allow users to automatically generate multiple invoice pdfs. Users should also be able to calculate invoice totals by chosen discount models.

## Architecture

The React client is a single-page application built using React and Material UI. The application is designed to consume an API for the sales system. The API should provide the necessary endpoints for managing customers, products, suppliers, deliveries, invoices, purchases, invoice adjustments, and other relevant information. The client should make requests to the API to retrieve and modify data as required.

![sdfsdf](https://user-images.githubusercontent.com/56351143/231991741-046e7a72-6441-43fe-9b67-e6d124c550ae.png)


## Design

The design of the React client is based on the Material UI framework, providing a clean and modern interface. The user interface enables users to manage customers, products, suppliers, deliveries, invoices, purchases, invoice adjustments, and other relevant information efficiently. The user interface should display data models in tables, cycle through invoice status by the invoice index table, and provide easy management of invoices and deliveries on a single page.

## Implementation


### Dashboard

![image](https://user-images.githubusercontent.com/56351143/231992205-47813d19-39d2-48b1-9eb6-5851a50e5c6b.png)

### Invoice Management Page

![image](https://user-images.githubusercontent.com/56351143/231992345-a308a950-b03b-414e-9069-7227953191d1.png)



