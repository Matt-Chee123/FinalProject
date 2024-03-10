import folium
from folium.plugins import HeatMap, MarkerCluster
import pandas as pd
from uniCoordsCS import universities_coordinates  # Ensure this is correctly imported
import urllib.parse

# Read the CSV file directly
df = pd.read_csv('../../db/data/outputOverallCS.csv')
df = df[df['Joint submission'] == 'Overall']
df['Average Score'] = ((df['% of eligible staff submitted'] * 4) + (df['4*'] * 3) + (df['3*'] * 2) + (df['2*'] * 1)) / 100
print(df)
# Convert universities_coordinates to a DataFrame for easier manipulation
universities_df = pd.DataFrame(list(universities_coordinates.items()), columns=['University', 'Coordinates'])

# Merge the average scores into the universities DataFrame
universities_df = universities_df.merge(df[['Institution code (UKPRN)', 'Average Score']], left_on='University', right_on='Institution code (UKPRN)', how='left')
# Extract Latitude and Longitude
universities_df[['Latitude', 'Longitude']] = pd.DataFrame(universities_df['Coordinates'].tolist(), index=universities_df.index)
# Use the 'Average Score' as intensity; fill missing values with a default intensity if needed
default_intensity = universities_df['Average Score'].mean()
universities_df['Average Score'].fillna(default_intensity, inplace=True)

# Create the heatmap
map_center = [universities_df['Latitude'].mean(), universities_df['Longitude'].mean()]
m = folium.Map(location=map_center, zoom_start=5)

# Add the heatmap layer
heat_data = [[row['Latitude'], row['Longitude'], row['Average Score']] for index, row in universities_df.iterrows()]
HeatMap(heat_data).add_to(m)

# Create a MarkerCluster object
marker_cluster = MarkerCluster().add_to(m)

# Add markers to the cluster instead of the map
for index, row in universities_df.iterrows():
    # Encode the university name for use in a URL
    encoded_name = urllib.parse.quote(row['University'])

    # Define the URL to redirect to, using the encoded university name as a query parameter
    target_url = f"uniAnalytics.html?query={encoded_name}"

    # Add a button to the popup content that redirects to the target URL when clicked
    popup_content = folium.Popup(f'''
    <div style="width:150px;">
        <strong>{row["University"]}</strong><br>
        Overall Score: {row["Average Score"]:.2f}
        <br><br>
        <a href="{target_url}" target="_blank" style="text-decoration:none;">
            <button style="width:100%; background-color:#4CAF50; color:white; padding:10px; border:none; cursor:pointer;">
                Visit Analytics Page
            </button>
        </a>
    </div>''', max_width=265)

    folium.Marker(
        [row['Latitude'], row['Longitude']],
        popup=popup_content
    ).add_to(marker_cluster)



# Save to HTML
m.save('ComputerScienceandInformatics_heatmap.html')

print("Heatmap with intensity and clustered markers created and saved.")